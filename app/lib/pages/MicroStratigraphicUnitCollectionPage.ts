import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { SearchPage } from '@lib/pages/SearchPage'

export class MicroStratigraphicUnitCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/micro-stratigraphic-units'
  readonly resourceCollectionLabel = /Microstratigraphic Units/
}
