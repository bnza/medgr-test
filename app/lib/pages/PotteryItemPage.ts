import { BaseItemPage } from '@lib/pages/BaseItemPage'
import { Locator } from '@playwright/test'

export class PotteryItemPage extends BaseItemPage {
  public readonly resourceItemLabel = /Pottery\W/
  protected readonly path: string = '/data/pottery'
  public readonly partVocabularySelect: Locator = this.page.getByRole(
    'textbox',
    { name: 'part' },
  )
  public readonly functionalGroupVocabularySelect: Locator =
    this.page.getByRole('textbox', { name: 'functional group' })
  public readonly typologyVocabularySelect: Locator = this.page.getByRole(
    'textbox',
    { name: 'typology' },
  )
}
