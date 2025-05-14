import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { MicroStratigraphicUnitCollectionPage } from '@lib/pages/MicroStratigraphicUnitCollectionPage'
import { MicroStratigraphicUnitItemPage } from '@lib/pages/MicroStratigraphicUnitItemPage'
import { SampleCollectionPage } from '@lib/pages/SampleCollectionPage'
import { SampleItemPage } from '@lib/pages/SampleItemPage'
import { NavigationLinksButton } from '@lib/index'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('MicroStratigraphicUnit', () => {
  test.describe('Base user', () => {
    test.use({ storageState: 'playwright/.auth/base.json' })
    test('Base user has no permission for MU', async ({ page }) => {
      const pom = new MicroStratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      for (const updateBtn of await page
        .getByTestId('update-item-button')
        .all()) {
        await expect(updateBtn).toHaveAttribute('disabled', 'true')
      }
      for (const deleteBtn of await page
        .getByTestId('delete-item-button')
        .all()) {
        await expect(deleteBtn).toHaveAttribute('disabled', 'true')
      }
    })
    test.describe('Geo Archaeologist user', () => {
      test.use({ storageState: 'playwright/.auth/geo.json' })
      test('Geo archaeologist base workflow', async ({ page }) => {
        const samplePom = new SampleCollectionPage(page)
        await samplePom.openAndExpectDataTable()
        await samplePom
          .getItemNavigationLink('AN.24.1001/3', NavigationLinksButton.Read)
          .click()
        const sampleItemPom = new SampleItemPage(page)
        await sampleItemPom.expectDataPage()
        await sampleItemPom.expectChildCollectionCard(
          'Microstratigraphic Units',
          'mu',
        )
        await page.getByTestId('collection-create-link').click()
        const pom = new MicroStratigraphicUnitItemPage(page)
        await pom.expectPageToHaveMode('create')

        // CREATE
        await pom.sUSelect.click()
        await pom.sUSelect.locator('input').fill('AN.24.1002')
        await page.getByRole('option', { name: 'AN.24.1002' }).click()
        await pom.expectAlertMessageAfterFill(
          page.getByLabel('number'),
          '1',
          /Duplicate/,
          true,
        )
        await page.getByLabel('number').fill('2')
        await page.getByLabel('deposit type').fill('Buried horizon C')
        await page.getByLabel('key attributes').fill('key attribute')
        await page.getByLabel('geology').fill('100')
        await page.getByLabel('building materials').fill('50')
        await page.getByLabel('domestic refuse').fill('0')
        await page.getByLabel('organic refuse').fill('0')
        await expect(
          page.getByText('Inclusions percentage sum is incorrect'),
        ).toHaveCount(1)
        await page.getByLabel('geology').fill('50')
        await expect(
          page.getByText('Inclusions percentage sum is incorrect'),
        ).toHaveCount(0)
        await page.getByLabel('PPL colour').fill('yellow')
        await page.getByLabel('XPL colour').fill('brown')
        await page.getByLabel('OIL colour').fill('cyan')

        await page.getByRole('button', { name: 'create' }).click()
        await pom.expectPageToHaveMode('read')
        await pom.expectTextInputToHaveValue('number', '2')

        // UPDATE
        await page.getByTestId('update-item-button').click()
        await pom.expectPageToHaveMode('update')
        await page.getByLabel('interpretation').fill('Some more description')
        await page.getByRole('button', { name: 'update' }).click()
        await pom.expectAppSnackbarToHaveText(/Successfully updated/)
        await pom.expectPageToHaveMode('read')
        await pom.expectTextInputToHaveValue(
          'interpretation',
          'Some more description',
        )

        //DELETE
        await page.getByTestId('delete-item-button').click()
        await pom.expectPageToHaveMode('delete')
        await page.getByRole('button', { name: 'delete' }).click()
        await pom.expectAppSnackbarToHaveText(/Successfully delete/)
      })
      test('Geo archaeologist permissions work as expected', async ({
        page,
      }) => {
        const pom = new MicroStratigraphicUnitCollectionPage(page)
        await pom.openAndExpectDataTable()
        for (const updateBtn of await page
          .getByRole('row')
          .filter({ hasText: /ED\./ })
          .getByTestId('update-item-button')
          .all()) {
          await expect(updateBtn).toHaveAttribute('disabled', 'true')
        }
        for (const updateBtn of await page
          .getByRole('row')
          .filter({ hasText: /AN\./ })
          .getByTestId('update-item-button')
          .all()) {
          await expect(updateBtn).not.toHaveAttribute('disabled')
        }
      })
    })
  })
})
