import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'

export class UserCollectionPage extends BaseCollectionPage {
  protected readonly path = '/admin/users'
  readonly resourceCollectionLabel = /Users/
}
