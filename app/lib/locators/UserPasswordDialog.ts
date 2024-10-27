import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'
import { expect, Locator } from '@playwright/test'

export default class UserPasswordDialog extends AbstractLocatorWrapper {
  public readonly cancelButton: Locator = this.locator.getByRole('button', {
    name: 'Cancel',
  })
  public readonly resetButton: Locator = this.locator.getByRole('button', {
    name: 'Reset',
  })
  public readonly copyButton: Locator = this.locator.getByRole('button', {
    name: 'Copy',
  })

  public readonly plainPassword = this.locator.locator('#plainPassword')
  async expectResettingPasswordMessage() {
    await expect(this.locator).toHaveText(/Resetting password/)
  }
  async expectPlainPasswordMessage() {
    await expect(this.plainPassword).toHaveCount(1)
  }
}
