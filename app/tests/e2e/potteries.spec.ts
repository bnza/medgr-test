import { test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import { PotteryItemPage } from '@lib/pages/PotteryItemPage'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Pottery', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Pottery base workflow', async ({ page }) => {
      const susPom = new StratigraphicUnitCollectionPage(page)
      const suPom = new StratigraphicUnitItemPage(page)
      await susPom.navigateToItemPage('ED.23.1001')
      await suPom.clickPageTab('potteries')

      await susPom.createLinkButton.click()
      const pom = new PotteryItemPage(page)
      await pom.expectPageToHaveMode('create')
      // CREATE
      await pom.expectAlertMessageAfterFill(
        page.getByLabel('number', { exact: true }),
        '1',
        /Duplicate/,
        true,
      )
      await pom.expectAlertMessageAfterFill(
        page.getByLabel('number', { exact: true }),
        '4',
        false,
        true,
      )

      await page.getByLabel('project identifier').fill('ED.23.pottery.test')
      await page.getByLabel('number of fragments').fill('5')
      await pom.partVocabularySelect.click()
      await pom.partVocabularySelect.fill('b')
      await page.getByRole('option', { name: 'body' }).click()
      await pom.functionalGroupVocabularySelect.click()
      await pom.functionalGroupVocabularySelect.fill('c')
      await page.getByRole('option', { name: 'construction' }).click()
      await pom.typologyVocabularySelect.click()
      await pom.typologyVocabularySelect.fill('b')
      await page.getByRole('option', { name: 'brick' }).click()
      await page.getByLabel('description').fill('The new pottery description')

      await page.getByRole('button', { name: 'create' }).click()
      await pom.expectPageToHaveMode('read')
      await pom.expectTextInputToHaveValue('number', '4')
      await pom.expectTextInputToHaveValue('number of fragments', '5')
      await pom.expectTextInputToHaveValue(
        'project identifier',
        'ED.23.pottery.test',
      )
      await pom.expectAutocompleteToContainText('part', 'body')
      await pom.expectAutocompleteToContainText(
        'functional group',
        'construction',
      )
      await pom.expectAutocompleteToContainText('typology', 'brick')
      await pom.expectTextInputToHaveValue(
        'description',
        'The new pottery description',
      )

      //UPDATE
      await page.getByTestId('update-item-button').click()
      await pom.expectPageToHaveMode('update')
      await pom.typologyVocabularySelect.click()
      await pom.typologyVocabularySelect.fill('p')
      await page.getByRole('option', { name: 'pipe' }).click()
      await page.getByLabel('description').fill('A different description')
      await page.getByRole('button', { name: 'update' }).click()
      await pom.expectAppSnackbarToHaveText(/Successfully updated/)
      await pom.expectPageToHaveMode('read')
      await pom.expectAutocompleteToContainText('typology', 'pipe')

      //DELETE
      await page.getByTestId('delete-item-button').click()
      await pom.expectPageToHaveMode('delete')
      await page.getByRole('button', { name: 'delete' }).click()
      await pom.expectAppSnackbarToHaveText(/Successfully delete/)
    })
  })
})
