import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'

export class StratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/stratigraphic-units'
  readonly resourceCollectionLabel = /Stratigraphic Units/

  async navigateToItemPage(rowSelector: number | string | RegExp) {
    await this.openAndExpectDataTable()
    await this.getItemNavigationLink(
      rowSelector,
      NavigationLinksButton.Read,
    ).click()
    const itemPom = new StratigraphicUnitItemPage(this.page)
    await itemPom.clickPageTab('media')
    await itemPom.expectAppDataCardToHaveTitle(itemPom.resourceItemLabel)
    return itemPom
  }

  async navigateToItemMediaTab(rowSelector: number | string | RegExp) {
    const itemPom = await this.navigateToItemPage(rowSelector)
    await itemPom.clickPageTab('media')
    return itemPom
  }
}
