import { BasePage } from '@lib/pages/BasePage'

export abstract class BaseItemPage extends BasePage {
  public abstract readonly resourceItemLabel: string | RegExp
  async expectDataPage() {
    await this.expectAppDataCardToHaveTitle(this.resourceItemLabel)
  }

  async clickPageTab(name: string) {
    await this.page.getByRole('tab', { name }).click()
  }
  async expectDataForm() {
    await this.expectAppDataCardToHaveTitle(this.resourceItemLabel)
  }
}
