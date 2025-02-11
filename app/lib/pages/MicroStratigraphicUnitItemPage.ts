import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'

export class MicroStratigraphicUnitItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Sample\W/
  protected readonly path: string = '/data/samples'
  public readonly sUSelect = this.page.getByRole('combobox').first()
}
