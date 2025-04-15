import { expect, test } from '@playwright/test'
import { loadFixtures, resetFixtureMedia } from '@lib/api'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import { SampleItemPage } from '@lib/pages/SampleItemPage'
import DatePicker from '@lib/locators/DatePicker'
import { NavigationLinksButton } from '@lib/index'
import { SampleCollectionPage } from '@lib/pages/SampleCollectionPage'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Samples', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Sample base workflow', async ({ page }) => {
      const susPom = new StratigraphicUnitCollectionPage(page)
      const suPom = new StratigraphicUnitItemPage(page)
      await susPom.navigateToItemPage('ED.23.1001')
      await suPom.clickPageTab('sample')
      await susPom.createLinkButton.click()
      const pom = new SampleItemPage(page)
      await pom.expectPageToHaveMode('create')

      // CREATE
      await pom.expectAlertMessageAfterFill(
        page.getByLabel('number'),
        '1',
        /Duplicate/,
        true,
      )
      await pom.expectAlertMessageAfterFill(
        page.getByLabel('number'),
        '4',
        false,
        true,
      )
      await page.getByLabel('description').fill('The new sample description')
      await page.getByLabel('collector').fill('John Doe')
      await page.getByLabel('date taken').click()
      const picker = new DatePicker(page.locator('.v-menu'))
      await picker.selectDate('2025', 'Jan', '17')
      await page.getByRole('button', { name: 'create' }).click()
      await pom.expectPageToHaveMode('read')
      await pom.expectTextInputToHaveValue('number', '4')
      await pom.expectTextInputToHaveValue(
        'description',
        'The new sample description',
      )
      await pom.expectTextInputToHaveValue('collector', 'John Doe')
      await pom.expectTextInputToHaveValue('date taken', '1/17/2025')

      //UPDATE
      await page.getByTestId('update-item-button').click()
      await pom.expectPageToHaveMode('update')
      await page.getByLabel('description').fill('. Some more description')
      await page.getByRole('button', { name: 'update' }).click()
      await pom.expectAppSnackbarToHaveText(/Successfully updated/)
      await pom.expectPageToHaveMode('read')

      //DELETE
      await page.getByTestId('delete-item-button').click()
      await pom.expectPageToHaveMode('delete')
      await page.getByRole('button', { name: 'delete' }).click()
      await pom.expectAppSnackbarToHaveText(/Successfully delete/)
    })
    test('Media tab works as expected', async ({ page }) => {
      resetFixtureMedia()
      const pom = new SampleCollectionPage(page)
      await pom.openAndExpectDataTable()
      const itemPom = await pom.navigateToItemMediaTab(0)
      await itemPom.mediaObjectContainer.expectMediaCardsCount(0)
      await itemPom.mediaObjectContainer.expectToBeReadonly()
      await itemPom.clickBackButton()
      await pom
        .getItemNavigationLink('ED\\.23\\.1001\/1', NavigationLinksButton.Read)
        .click()
      await itemPom.clickPageTab('media')
      await itemPom.mediaObjectContainer.expectToBeEditable()
      await itemPom.mediaObjectContainer.expectCreateMediaToBeSuccessful(
        'ED241001A.xls',
      )
      await itemPom.mediaObjectContainer.expectDeleteMediaToBeSuccessful(0)
    })
  })
})
