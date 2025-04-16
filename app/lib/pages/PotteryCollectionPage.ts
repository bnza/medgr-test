import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { PotteryItemPage } from '@lib/pages/PotteryItemPage'

export class PotteryCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/potteries'
  readonly resourceCollectionLabel = /Potteries/
  getItemPageClass(): typeof PotteryItemPage {
    return PotteryItemPage
  }
}
