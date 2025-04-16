import { BasePage } from '@lib/pages/BasePage'
import { expect, Locator } from '@playwright/test'
import { NavigationLinksButton } from '@lib/index'
import MediaObjectJoinContainer from '@lib/locators/MediaObjectJoinContainer'

type ApiAction = 'read' | 'create' | 'update' | 'delete'
export abstract class BaseItemPage extends BasePage {
  public abstract readonly resourceItemLabel: string | RegExp
  public readonly dataItemForm = this.appDataCard.getByTestId('data-item-form')
  public readonly deleteNavigationLink = this.appDataCard.getByTestId(
    NavigationLinksButton.Delete,
  )
  public readonly updateNavigationLink = this.appDataCard.getByTestId(
    NavigationLinksButton.Update,
  )
  public readonly submitFormButton =
    this.appDataCard.getByTestId('submit-form-button')

  public readonly mediaObjectContainer = new MediaObjectJoinContainer(
    this.page.getByTestId('media-object-join-container'),
  )
  async clickPageTab(name: string) {
    await this.page.getByRole('tab', { name }).click()
  }

  async clickBackButton() {
    await this.page.getByTestId('navigation-link-back').click()
  }
  async expectDataPage() {
    await this.expectAppDataCardToHaveTitle(this.resourceItemLabel)
  }

  async expectChildCollectionCard(name: string, tab?: string) {
    await this.clickPageTab(name)
    const collectionCard = this.page.getByTestId(`tabs-item-${tab || name}`)
    await expect(collectionCard).toBeAttached()
  }

  async expectDataForm() {
    await this.expectAppDataCardToHaveTitle(this.resourceItemLabel)
    await expect(this.dataItemForm).toBeAttached()
  }

  async expectPageToHaveMode(mode: ApiAction) {
    if (mode === 'read') {
      return await expect(this.submitFormButton).not.toBeAttached()
    }
    await expect(this.submitFormButton).toHaveText(mode)
  }

  async expectTextInputToBeDisabled(label: string, flag = true) {
    const expectation = expect(
      this.dataItemForm.getByLabel(label, { exact: true }),
      // this.dataItemForm.locator('label', { hasText: new RegExp(`\^${label}`) }),
    )

    await (flag
      ? expectation.toHaveAttribute('disabled')
      : expectation.not.toHaveAttribute('disabled'))
  }

  async expectSubmitSucceed(
    message: string | RegExp,
    redirectMode?: ApiAction,
  ) {
    await this.submitFormButton.click()
    await this.expectAppSnackbarToHaveText(message)
    if (redirectMode) {
      await this.expectPageToHaveMode(redirectMode)
    }
  }

  async expectFormAlertMessage(
    message: string | RegExp | false,
    hasNotText?: string | RegExp | undefined,
  ) {
    if (false === message) {
      const alerts = this.dataItemForm
        .getByRole('alert')
        .filter({ has: this.page.locator('div'), hasText: /^.+$/ })
      return await expect(
        this.dataItemForm.locator('div.v-input--error').filter({
          has: alerts,
        }),
      ).toHaveCount(0)
    }
    await expect(
      this.dataItemForm
        .getByRole('alert')
        .filter({ has: this.page.locator('div'), hasText: message }),
    ).toHaveText(message)
  }

  async expectAlertMessageAfterFill(
    locator: Locator,
    text: string,
    message: string | RegExp | false,
    tab = false,
  ) {
    await locator.fill(text)
    if (tab) {
      await locator.press('Tab')
    }
    await this.expectFormAlertMessage(message)
  }

  async expectDataCardToHaveItemTitle() {
    return this.expectAppDataCardToHaveTitle(this.resourceItemLabel)
  }
}
