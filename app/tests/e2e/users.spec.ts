import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { UserCollectionPage } from '@lib/pages/UserCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { UserItemPage } from '@lib/pages/UserItemPage'
import { LoginPage } from '@lib/pages/LoginPage'
import { SitesUserItemPage } from '@lib/pages/SitesUserItemPage'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Users', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })
    test('Has expected permissions', async ({ page }) => {
      const pom = new UserCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectNavigationItemsLinkEnabledStatus(
        [true, true, true],
        'user_base@example.com',
      )
      await pom.expectNavigationItemsLinkEnabledStatus(
        [true, false, false],
        'user_admin@example.com',
      )
    })
    test('Cannot reset his own password', async ({ page }) => {
      const pom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)
      await pom.openAndExpectDataTable()
      await pom
        .getItemNavigationLink(
          'user_admin@example.com',
          NavigationLinksButton.Read,
        )
        .click()
      await expect(itemPom.resetPasswordButton).toBeDisabled()
    })

    test("Can reset users' password", async ({ page, browser }) => {
      const pom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)
      await pom.openAndExpectDataTable()
      await pom
        .getItemNavigationLink(
          'user_base@example.com',
          NavigationLinksButton.Read,
        )
        .click()
      await itemPom.resetPasswordButton.click()
      await itemPom.userPasswordDialog.resetButton.click()
      await itemPom.userPasswordDialog.expectResettingPasswordMessage()
      await itemPom.userPasswordDialog.expectPlainPasswordMessage()
      await itemPom.userPasswordDialog.copyButton.click()
      await itemPom.expectAppSnackbarToHaveText(/Copied/)

      const password =
        await itemPom.userPasswordDialog.plainPassword.textContent()
      const userContext = await browser.newContext({
        storageState: { cookies: [], origins: [] },
      })
      const userContextPage = await userContext.newPage()
      const loginPage = new LoginPage(userContextPage)
      await loginPage.open()
      await loginPage.login({ email: 'user_base@example.com', password })
      await loginPage.expectAppSnackbarToHaveText(/successfully logged in/)
    })

    test('Can set user privileges on sites', async ({ page }) => {
      const pom = new UserCollectionPage(page)
      const itemPom = new UserItemPage(page)
      const privilegesItemPom = new SitesUserItemPage(page)
      await pom.openAndExpectDataTable()
      await pom
        .getItemNavigationLink(
          'user_base@example.com',
          NavigationLinksButton.Read,
        )
        .click()
      await itemPom.clickPageTab('sites privileges')
      const privilegesCollectionTable = itemPom.sitesUserCollectionPage
      await privilegesCollectionTable.expectDataTable(false)
      await privilegesCollectionTable.clickTableHeader('ID')
      await privilegesCollectionTable.createLinkButton.click()
      await privilegesItemPom.expectTextInputToBeDisabled('user')
      await privilegesItemPom.fillAndClickAutocomplete(
        privilegesItemPom.siteInput,
        'ed',
        true,
      )
      await privilegesItemPom.expectFormAlertMessage(/Duplicate/)
      await privilegesItemPom.fillAndClickAutocomplete(
        privilegesItemPom.siteInput,
        'jb',
        true,
      )
      await privilegesItemPom.expectFormAlertMessage(false, /Click/)
      await privilegesItemPom.sitesUserPrivilegesCheckbox.click()
      await privilegesItemPom.expectSubmitSucceed(
        'Successfully created resource',
        'read',
      )
      await expect(privilegesItemPom.sitesUserPrivilegesCheckbox).toHaveText(
        'ROLE_SITE_EDITOR',
      )
      await privilegesItemPom.updateNavigationLink.click()
      await privilegesItemPom.expectTextInputToBeDisabled('site')
      await privilegesItemPom.expectTextInputToBeDisabled('user')
      await privilegesItemPom.sitesUserPrivilegesCheckbox.click()
      await privilegesItemPom.expectSubmitSucceed(
        'Successfully updated resource',
        'read',
      )
      await expect(privilegesItemPom.sitesUserPrivilegesCheckbox).toHaveText(
        'ROLE_SITE_USER',
      )
      await privilegesItemPom.deleteNavigationLink.click()
      await privilegesItemPom.expectSubmitSucceed(
        'Successfully deleted resource',
      )
      await itemPom.expectDataPage()
    })
  })
})
