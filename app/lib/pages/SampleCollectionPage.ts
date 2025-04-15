import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { SampleItemPage } from '@lib/pages/SampleItemPage'

export class SampleCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/samples'
  readonly resourceCollectionLabel = /Samples/
  getItemPageClass(): typeof SampleItemPage {
    return SampleItemPage
  }
}
