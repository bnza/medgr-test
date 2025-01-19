import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { SearchPage } from '@lib/pages/SearchPage'

export class SampleCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/samples'
  readonly resourceCollectionLabel = /Samples/
}
