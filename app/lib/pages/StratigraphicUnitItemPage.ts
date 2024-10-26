import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { SiteItemPage } from '@lib/pages/SiteItemPage'

export class StratigraphicUnitItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Stratigraphic Unit\W/
  protected readonly path: string = '/data/stratigraphic-units'
  // @ts-ignore
  #siteCollectionPage: SiteCollectionPage | undefined
  // @ts-ignore
  #siteItemPage: SiteItemPage | undefined

  public get siteCollectionPage() {
    if (!this.#siteCollectionPage) {
      this.#siteCollectionPage = new SiteCollectionPage(this.page)
    }
    return this.#siteCollectionPage
  }
  public get siteItemPage() {
    if (!this.#siteItemPage) {
      this.#siteItemPage = new SiteItemPage(this.page)
    }
    return this.#siteItemPage
  }
  async navigateFromSiteCollection(siteCode: string, suCode: string) {
    await this.siteCollectionPage.expectDataTable()
    await this.siteCollectionPage
      .getItemNavigationLink(siteCode, NavigationLinksButton.Read)
      .click()
    await this.siteItemPage.clickPageTab('stratigraphic units')
    await this.siteItemPage.stratigraphicCollectionCard
      .getItemNavigationLink(suCode, NavigationLinksButton.Read)
      .click()
    await this.expectDataForm()
  }
}
