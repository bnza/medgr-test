import { test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { SiteItemPage } from '@lib/pages/SiteItemPage'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Sites', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Sites base workflow', async ({ page }) => {
      const pom = new SiteCollectionPage(page)
      const itemPom = new SiteItemPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectUnauthenticatedUserNavigationLinkEnabledStatus([
        true,
        true,
        true,
      ])

      // CREATE
      await pom.createLinkButton.click()
      await itemPom.expectDataForm()
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('code'),
        'ED',
        'Duplicate code',
      )
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('code'),
        'QQ',
        false,
      )
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('name'),
        'Al Ain',
        'Duplicate name',
      )
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('name'),
        'New site',
        false,
      )
      await itemPom.page
        .getByLabel('description')
        .fill('Description of the new site')
      await itemPom.expectSubmitSucceed('Successfully created resource', 'read')
      await itemPom.expectTextInputToHaveValue('code', 'QQ')
      await itemPom.expectTextInputToHaveValue('name', 'New site')
      await itemPom.expectTextInputToHaveValue(
        'description',
        'Description of the new site',
      )

      // UPDATE
      await itemPom.updateNavigationLink.click()
      await itemPom.expectPageToHaveMode('update')
      await itemPom.expectTextInputToBeDisabled('code')
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('name'),
        'New site updated',
        false,
      )
      await itemPom.page
        .getByLabel('description')
        .fill('Description of the new site updated')
      await itemPom.expectSubmitSucceed('Successfully updated resource', 'read')
      await itemPom.expectTextInputToHaveValue('code', 'QQ')
      await itemPom.expectTextInputToHaveValue('name', 'New site updated')
      await itemPom.expectTextInputToHaveValue(
        'description',
        'Description of the new site updated',
      )

      // DELETE
      await itemPom.deleteNavigationLink.click()
      await itemPom.expectPageToHaveMode('delete')
      await itemPom.expectSubmitSucceed('Successfully deleted resource')
      await pom.expectDataTable()
    })
  })
})
