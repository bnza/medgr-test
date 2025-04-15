import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { MicroStratigraphicUnitItemPage } from '@lib/pages/MicroStratigraphicUnitItemPage'

export class MicroStratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/micro-stratigraphic-units'
  readonly resourceCollectionLabel = /Microstratigraphic Units/

  getItemPageClass(): typeof MicroStratigraphicUnitItemPage {
    return MicroStratigraphicUnitItemPage
  }
}
