import { BaseCollectionPage } from '@lib/pages/BaseCollectionPage'
import { SearchPage } from '@lib/pages/SearchPage'
import { SiteItemPage } from '@lib/pages/SiteItemPage'

export class SiteCollectionPage extends BaseCollectionPage {
  protected readonly path = '/data/sites'
  readonly resourceCollectionLabel = /Sites/

  getItemPageClass(): typeof SiteItemPage {
    return SiteItemPage
  }

  async simpleFilter(
    filter = {
      property: 'description',
      operator: 'contains',
      value: 'uae',
    },
  ) {
    const searchPom = new SearchPage(this.page)
    await this.searchLinkButton.click()
    await searchPom.simpleFilter('sites', filter)
    await this.expectDataTable()
  }
}
