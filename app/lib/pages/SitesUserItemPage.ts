import { BaseItemPage } from '@lib/pages/BaseItemPage'
import StratigraphicUnitsRelationshipContainer from '@lib/locators/StratigraphicUnitsRelationshipContainer'

export class SitesUserItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Sites\/Users\W/
  protected readonly path: string = '/admin/sites-users-privileges'

  readonly sitesUserPrivilegesCheckbox = this.dataItemForm.getByTestId(
    'privileges-checkbox',
  )
  readonly siteInput = this.dataItemForm.getByLabel('site', { exact: true })
  readonly userInput = this.dataItemForm.getByLabel('user', { exact: true })
}
