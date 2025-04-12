import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'
import { expect } from '@playwright/test'

export default class InfoBox extends AbstractLocatorWrapper {
  public readonly title = this.locator.getByTestId('info-box-card-title')
  public readonly content = this.locator.getByTestId('info-box-card-text')
  public viewButtons = this.locator.getByTestId('read-item-button')

  public async expectTitle(title: string | RegExp) {
    await expect(this.title).toHaveText(title)
  }

  public async expectContentContains(content: string | RegExp) {
    await expect(this.content).toHaveText(content)
  }

  public async expectViewButtonIsEnabled() {
    await expect(this.viewButtons).not.toHaveAttribute('disabled')
  }
}
