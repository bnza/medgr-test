import { BasePage } from '@lib/pages/BasePage'
import { expect } from '@playwright/test'

export class SearchPage extends BasePage {
  public readonly path = '/'
  public readonly addFilterDialogButton =
    this.page.getByTestId('add-filter-button')
  public readonly addFilterDialog = this.page.getByTestId('edit-filter-dialog')
  public readonly propertySelect = this.addFilterDialog
    .getByRole('combobox')
    .first()
  public readonly operatorSelect = this.addFilterDialog
    .getByRole('combobox')
    .nth(1)
  public readonly operandSingleInput = this.addFilterDialog.getByLabel('value')
  public readonly addFilterButton = this.addFilterDialog.getByRole('button', {
    name: 'Add',
  })

  public readonly submitFiltersButton = this.page.getByRole('button', {
    name: 'Submit',
  })
  async expectAddFilterButtonToOpenDialog() {
    await this.addFilterDialogButton.click()
    await expect(
      this.addFilterDialog.getByTestId('edit-filter-dialog-title'),
    ).toHaveText('Add filter')
  }

  async selectProperty(property: string) {
    await this.propertySelect.click()
    await this.page.getByRole('option', { name: property }).click()
  }
  async selectOperator(property: string) {
    await this.operatorSelect.click()
    await this.page.getByRole('option', { name: property }).click()
  }

  async expectAppDataCardToHaveTitle(title: string | RegExp) {
    super.expectAppDataCardToHaveTitle(
      title instanceof RegExp
        ? title
        : new RegExp(`search\\s\\(${title}\\)`, 'i'),
    )
  }
}
