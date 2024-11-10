import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'
import { expect, Locator } from '@playwright/test'

export default class ResourceCollectionDownloadDialog extends AbstractLocatorWrapper {
  public readonly cancelButton: Locator = this.locator.getByRole('button', {
    name: 'cancel',
  })
  public readonly downloadButton: Locator = this.locator.getByRole('button', {
    name: 'download',
  })

  async expectDownloadToBeSuccessful(): Promise<void> {
    const downloadPromise = this.locator.page().waitForEvent('download')
    await this.downloadButton.click()
    const download = await downloadPromise
    expect(await download.failure()).toBeFalsy()
  }
}
