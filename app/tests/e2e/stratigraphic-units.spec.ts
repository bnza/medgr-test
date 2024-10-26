import { test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Stratigraphic Units', () => {
  test.describe('Admin user', () => {
    test.use({ storageState: 'playwright/.auth/admin.json' })

    test('Stratigraphic Units base workflow', async ({ page }) => {
      const itemPom = new StratigraphicUnitItemPage(page)
      await itemPom.siteCollectionPage.open()

      await itemPom.siteCollectionPage
        .getItemNavigationLink('ED', NavigationLinksButton.Read)
        .click()
      await itemPom.siteItemPage.expectDataForm()
      await itemPom.siteItemPage.clickPageTab('stratigraphic units')

      // await itemPom.navigateFromSiteCollection('ED', 'ED\\.2023\\.1001')
      const pom = itemPom.siteItemPage.stratigraphicCollectionCard
      await pom.expectUnauthenticatedUserNavigationLinkEnabledStatus([
        true,
        true,
        true,
      ])

      // CREATE
      await pom.createLinkButton.click()
      await itemPom.expectDataForm()
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('year'),
        '2023',
        false,
        true,
      )
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('number'),
        '1001',
        /Duplicate/,
        true,
      )
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('number'),
        '1999',
        false,
        true,
      )
      await itemPom.page
        .getByLabel('description')
        .fill('Description of the new SU')

      await itemPom.page
        .getByLabel('interpretation')
        .fill('Interpretation of the new SU')
      await itemPom.expectSubmitSucceed('Successfully created resource', 'read')
      await itemPom.expectTextInputToHaveValue('year', '2023')
      await itemPom.expectTextInputToHaveValue('number', '1999')
      await itemPom.expectTextInputToHaveValue(
        'description',
        'Description of the new SU',
      )

      // UPDATE
      await itemPom.updateNavigationLink.click()
      await itemPom.expectPageToHaveMode('update')
      await itemPom.expectTextInputToBeDisabled('year')
      await itemPom.expectTextInputToBeDisabled('number')
      await itemPom.expectAlertMessageAfterFill(
        itemPom.page.getByLabel('description'),
        'Description of the new SU updated',
        false,
      )
      await itemPom.page
        .getByLabel('interpretation')
        .fill('Interpretation of the new SU updated')
      await itemPom.expectSubmitSucceed('Successfully updated resource', 'read')
      await itemPom.expectTextInputToHaveValue(
        'description',
        'Description of the new SU updated',
      )
      await itemPom.expectTextInputToHaveValue(
        'interpretation',
        'Interpretation of the new SU updated',
      )

      // DELETE
      await itemPom.deleteNavigationLink.click()
      await itemPom.expectPageToHaveMode('delete')
      await itemPom.expectSubmitSucceed('Successfully deleted resource')
      await itemPom.siteItemPage.expectChildCollectionCard(
        'Stratigraphic units',
        'sus',
      )
    })
  })
})
