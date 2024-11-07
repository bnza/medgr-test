import { expect, Locator, Page } from '@playwright/test'
import { isInViewport } from '@lib/index'
export abstract class BasePage {
  protected abstract readonly path: string
  constructor(public readonly page: Page) {}

  public readonly appBarNavIcon = this.page.getByTestId('app-bar-nav-icon')
  public readonly appDataCard = this.page.getByTestId('app-data-card')
  public readonly appNavigationDrawer = this.page.getByTestId(
    'app-navigation-drawer',
  )
  public readonly appSnackbars = this.page.getByTestId('app-snackbar')
  public readonly loginButton = this.page.getByTestId('login-button')

  async open(path = '') {
    await this.page.goto('#' + (path || this.path))
  }

  async openAppNavigationDrawer() {
    if (!(await isInViewport(this.appNavigationDrawer))) {
      await this.appBarNavIcon.click()
    }
  }

  async clickAppNavigationDrawerListItem(listItemsTestIds: string[]) {
    await this.openAppNavigationDrawer()
    for (const testId of listItemsTestIds) {
      await this.appNavigationDrawer.getByTestId(testId).click()
    }
  }

  async fillAndClickAutocomplete(
    locator: Locator,
    text: string,
    tab: boolean = false,
  ) {
    await locator.fill(text)
    await locator.page().waitForResponse(/.+/)
    await locator.page().getByRole('option').first().click()
    if (tab) {
      await locator.press('Tab')
    }
  }

  async expectAppSnackbarToHaveText(text: string | RegExp, count = 1) {
    await expect(this.appSnackbars.getByText(text)).toHaveCount(count)
  }

  async expectAppDataCardToHaveTitle(title: string | RegExp) {
    await expect(this.appDataCard).toHaveText(title)
  }
  async expectTextInputToHaveValue(label: string, value: string | RegExp) {
    await expect(this.page.getByLabel(label)).toHaveValue(value)
  }
}
