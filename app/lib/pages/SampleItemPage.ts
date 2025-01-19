import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'

export class SampleItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Sample\W/
  protected readonly path: string = '/data/samples'
}
