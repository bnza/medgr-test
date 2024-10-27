import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import UserPasswordDialog from '@lib/locators/UserPasswordDialog'

export class UserItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /User\W/
  protected readonly path: string = '/admin/users'

  public readonly resetPasswordButton =
    this.appDataCard.getByTestId('change-pw-button')

  public readonly userPasswordDialog = new UserPasswordDialog(
    this.page.getByTestId('user-pw-dialog'),
  )
}
