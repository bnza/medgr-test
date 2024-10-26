import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'

export class SiteItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Site\W/
  protected readonly path: string = '/data/sites'

  // @ts-ignore
  #stratigraphicUnitCollectionCard: StratigraphicUnitCollectionPage | undefined

  get stratigraphicCollectionCard() {
    if (!this.#stratigraphicUnitCollectionCard) {
      this.#stratigraphicUnitCollectionCard =
        new StratigraphicUnitCollectionPage(this.page)
    }
    return this.#stratigraphicUnitCollectionCard
  }
}
