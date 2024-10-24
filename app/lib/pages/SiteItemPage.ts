import { BaseItemPage } from '@lib/pages/BaseItemPage'

export class SiteItemPage extends BaseItemPage {
  public readonly resourceItemLabel = 'Site'
  protected readonly path: string = '/data/sites'
}
