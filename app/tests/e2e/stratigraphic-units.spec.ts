import { expect, test } from '@playwright/test'
import { loadFixtures, resetFixtureMedia } from '@lib/api'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Stratigraphic Units', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Media tab works as expected', async ({ page }) => {
      resetFixtureMedia()
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      const itemPom = await pom.navigateToItemMediaTab(0)
      await itemPom.mediaObjectContainer.expectMediaCardsCount(1)
      await itemPom.mediaObjectContainer.expectToBeReadonly()
      await itemPom.clickBackButton()
      await pom
        .getItemNavigationLink('ED\\.23\\.1001', NavigationLinksButton.Read)
        .click()
      await itemPom.clickPageTab('media')
      await itemPom.mediaObjectContainer.expectToBeEditable()
      await itemPom.mediaObjectContainer.expectDeleteMediaToBeSuccessful(0)
      await itemPom.mediaObjectContainer.expectCreateMediaToBeSuccessful(
        'ED241001A.xls',
      )
      await itemPom.mediaObjectContainer.uploadMedia(
        'ED221001B_changedName.pdf',
      )
      await itemPom.expectAppSnackbarToHaveText(/Duplicate/)
      await itemPom.mediaObjectContainer.createMediaObjectDialog
        .getByRole('button', { name: 'close' })
        .click()
      await expect(
        itemPom.mediaObjectContainer.createMediaObjectDialog,
      ).toHaveCount(0)
    })

    test('Stratigraphic relationships units works as expected', async ({
      page,
    }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom
        .getItemNavigationLink('ED\\.23\\.1001', NavigationLinksButton.Read)
        .click()
      const itemPom = new StratigraphicUnitItemPage(page)
      await itemPom.clickPageTab('relationships')
      await itemPom.susRelationshipContainer.expectToBeReadonly()
      await itemPom.susRelationshipContainer.expectCardToHaveChipsCount(
        'cover to',
        1,
      )
      await itemPom.susRelationshipContainer.enableEditingButton.click()
      await itemPom.susRelationshipContainer.expectToBeEditable()
      await itemPom.susRelationshipContainer.clickAddRelationshipButton(
        'cover to',
      )
      await itemPom.susRelationshipContainer.submitCreateRelationship('03', 0)
      await itemPom.expectAppSnackbarToHaveText(/Successfully created/)
      await itemPom.susRelationshipContainer.expectCardToHaveChipsCount(
        'cover to',
        2,
      )
      await itemPom.susRelationshipContainer
        .getSuRelationshipChip('cover to', '23.1002')
        .getByTestId('delete-relationship-button')
        .click()
      await itemPom.susRelationshipContainer.deleteRelationshipDialog
        .getByRole('button', { name: 'delete' })
        .click()
      await itemPom.expectAppSnackbarToHaveText(/Successfully deleted/)
      await itemPom.susRelationshipContainer.expectCardToHaveChipsCount(
        'cover to',
        1,
      )
    })
  })

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

      const pom = itemPom.siteItemPage.stratigraphicCollectionCard
      await pom.expectNavigationItemsLinkEnabledStatus([true, true, true])

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

    test('Media tab works as expected', async ({ page }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      const itemPom = await pom.navigateToItemMediaTab(0)
      await itemPom.mediaObjectContainer.expectMediaCardsCount(1)
      await itemPom.mediaObjectContainer.expectToBeEditable()
      await itemPom.clickBackButton()
      await pom.getItemNavigationLink(1, NavigationLinksButton.Read).click()
      await itemPom.mediaObjectContainer.expectNoMediaFound()
    })
  })
})
