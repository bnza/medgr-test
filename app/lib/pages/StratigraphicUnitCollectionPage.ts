import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'

export class StratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/stratigraphic-units'
  readonly resourceCollectionLabel = /Stratigraphic Units/

  getItemPageClass(): typeof StratigraphicUnitItemPage {
    return StratigraphicUnitItemPage
  }
}
