import { BaseItemPage } from '@lib/pages/BaseItemPage'
import UserPasswordDialog from '@lib/locators/UserPasswordDialog'
import { SitesUserCollectionPage } from '@lib/pages/SitesUserCollectionPage'

export class UserItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /User\W/
  protected readonly path: string = '/admin/users'

  // @ts-ignore
  #sitesUserCollectionPage: SitesUserCollectionPage | undefined

  public readonly resetPasswordButton =
    this.appDataCard.getByTestId('change-pw-button')

  public readonly userPasswordDialog = new UserPasswordDialog(
    this.page.getByTestId('user-pw-dialog'),
  )

  get sitesUserCollectionPage() {
    if (!this.#sitesUserCollectionPage) {
      this.#sitesUserCollectionPage = new SitesUserCollectionPage(this.page)
    }
    return this.#sitesUserCollectionPage
  }
}
