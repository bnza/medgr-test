import { BasePage } from '@lib/pages/BasePage'

export class HomePage extends BasePage {
  protected readonly path = '/'

  async openAndNavigateToCollectionByNavigationDrawer(testIds: string[]) {
    await this.open()
    await this.clickAppNavigationDrawerListItem(testIds)
  }
}
