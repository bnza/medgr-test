import { BasePage } from '@lib/pages/BasePage'
import { Page } from '@playwright/test'
import * as path from 'node:path'

export class DataImportPage extends BasePage {
  public readonly importForm = this.page.getByTestId('import-file-form')
  public readonly inputFile = this.importForm.getByLabel('file', {
    exact: true,
  })
  public readonly inputDescription = this.importForm.getByLabel('description')

  public readonly importFileStatusBanner = this.page.getByTestId(
    'import-file-status-banner',
  )

  public readonly importFileReport =
    this.importForm.getByTestId('import-file-report')

  public readonly importedFileSuccessForm = this.page.getByTestId(
    'imported-file-success-form',
  )

  public readonly verificationFailureLink = this.page.getByTestId(
    'verification-failure-report-link',
  )
  constructor(
    page: Page,
    readonly path: string,
  ) {
    super(page)
  }

  async uploadFile(fileName: string, description: string) {
    console.log(__dirname)
    await this.inputFile.setInputFiles(
      path.join(__dirname, '../../fixtures/import_files', fileName),
    )
    await this.inputDescription.fill(description)
    await this.page.getByRole('button', { name: 'submit' }).click()
  }
}
