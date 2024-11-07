import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'
import { expect, Locator } from '@playwright/test'
import * as path from 'node:path'

export default class MediaObjectJoinContainer extends AbstractLocatorWrapper {
  readonly mediaCards: Locator = this.locator
    .page()
    .getByTestId('media-object-join-card')

  readonly createMediaButton: Locator = this.locator
    .page()
    .getByTestId('create-media-button')

  readonly deleteMediaObjectDialog: Locator = this.locator
    .page()
    .getByTestId('delete-media-object-card')

  readonly createMediaObjectDialog: Locator = this.locator
    .page()
    .getByTestId('create-media-object-card')
  async expectToBeReadonly() {
    await expect(this.createMediaButton).toHaveCount(0)
    for (const mediaCard of await this.mediaCards.all()) {
      await expect(mediaCard.getByTestId('delete-media-button')).toHaveCount(0)
    }
  }
  async expectToBeEditable() {
    await expect(this.createMediaButton).not.toHaveCount(0)
    for (const mediaCard of await this.mediaCards.all()) {
      await expect(mediaCard.getByTestId('delete-media-button')).toHaveCount(1)
    }
  }

  async expectMediaCardsCount(count: number) {
    await expect(this.mediaCards).toHaveCount(count)
  }
  async expectNoMediaFound() {
    await expect(this.locator).toHaveText(/No media found/)
  }

  async expectDeleteMediaToBeSuccessful(nth: number) {
    const count = await this.mediaCards.count()
    await this.mediaCards.nth(nth).getByTestId('delete-media-button').click()
    await expect(this.deleteMediaObjectDialog).toHaveText(
      /Are you sure you want to delete/,
    )
    await this.deleteMediaObjectDialog
      .getByRole('button', { name: 'delete' })
      .click()
    await expect(this.mediaCards).toHaveCount(count - 1)
  }

  async uploadMedia(fileName: string) {
    await this.createMediaButton.click()
    await this.createMediaObjectDialog
      .getByLabel('File input', { exact: true })
      .setInputFiles(path.join(__dirname, '../../fixtures/media', fileName))
    await this.createMediaObjectDialog
      .getByRole('button', { name: 'submit' })
      .click()
  }
  async expectCreateMediaToBeSuccessful(fileName: string) {
    const count = await this.mediaCards.count()
    await this.uploadMedia(fileName)
    await expect(this.createMediaObjectDialog).toHaveText(/Request in progress/)
    await expect(this.mediaCards).toHaveCount(count + 1)
  }
}
