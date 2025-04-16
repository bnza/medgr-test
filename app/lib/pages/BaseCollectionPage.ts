import { BasePage } from '@lib/pages/BasePage'
import { expect } from '@playwright/test'
import { NavigationLinksButton } from '@lib/index'
import ResourceCollectionDownloadDialog from '@lib/locators/ResourceCollectionDownloadDialog'
import { BaseItemPage } from '@lib/pages/BaseItemPage'

type NavigationItemLinkStatus = [boolean, boolean, boolean]
const navigationItemLinkStatusIndex = {
  [NavigationLinksButton.Read]: 0,
  [NavigationLinksButton.Update]: 1,
  [NavigationLinksButton.Delete]: 2,
}

export abstract class BaseCollectionPage extends BasePage {
  // @ts-ignore
  #downloadCollectionDialog: ResourceCollectionDownloadDialog | undefined
  public abstract readonly resourceCollectionLabel: string | RegExp

  public readonly dataCollectionTable = this.page.getByTestId(
    'data-collection-table',
  )
  public readonly idHeader = this.page.getByRole('cell', {
    name: 'ID',
    exact: true,
  })

  public readonly searchLinkButton = this.page.getByTestId(
    'collection-search-link',
  )
  public readonly createLinkButton = this.page.getByTestId(
    'collection-create-link',
  )
  public readonly downloadResourceButton = this.page.getByTestId(
    'download-resource-button',
  )
  public readonly collectionImportLink = this.page.getByTestId(
    'collection-import-link',
  )

  get downloadCollectionDialog() {
    if (!this.#downloadCollectionDialog) {
      this.#downloadCollectionDialog = new ResourceCollectionDownloadDialog(
        this.page.getByTestId('download-collection-dialog'),
      )
    }
    return this.#downloadCollectionDialog
  }

  abstract getItemPageClass(): new (...args: any[]) => BaseItemPage

  async expectTableTotalItems(number: number) {
    await expect(this.dataCollectionTable).toHaveText(
      new RegExp(`\\d+\\sof\\s${number}$`),
    )
  }

  async clickTableHeader(name: string) {
    await this.dataCollectionTable
      .getByRole('row')
      .first()
      .getByRole('cell', { name, exact: true })
      .click()
  }

  getItemNavigationLink(rowSelector: number | string | RegExp, testId: string) {
    return this.getTableDataRow(rowSelector).getByTestId(testId)
  }

  getTableDataRow(nthOrText: number | string | RegExp) {
    return typeof nthOrText === 'number'
      ? this.dataCollectionTable.getByRole('row').nth(nthOrText + 1)
      : this.getTableDataRowByText(nthOrText)
  }

  getTableDataRowByText(text: string | RegExp) {
    if ('string' === typeof text) {
      text = new RegExp(`^${text}`)
    }
    return this.dataCollectionTable
      .getByRole('row')
      .filter({ has: this.page.locator('td', { hasText: text }) })
  }
  async expectClickTableHeaderToSendOrderCollectionRequest(
    headerName: string,
    glob: string,
    propertyName?: string,
  ) {
    const requestPromise = this.page.waitForRequest(glob)
    await this.clickTableHeader(headerName)
    const request = await requestPromise
    expect(request.url(), 'Order collection request sent').toMatch(
      new RegExp(`order%5B${propertyName || headerName}%5D`),
    )
  }

  async expectDataCardToHaveCollectionTitle() {
    return this.expectAppDataCardToHaveTitle(this.resourceCollectionLabel)
  }

  async openAndExpectDataTable() {
    await this.open()
    await this.expectDataTable()
  }
  async expectDataTable(main = true) {
    if (main) {
      await this.expectAppDataCardToHaveTitle(this.resourceCollectionLabel)
    }
    await expect(this.dataCollectionTable).toHaveCount(1)

    await expect(this.dataCollectionTable.getByText(/Loading/)).toHaveCount(0)
  }

  async expectItemNavigationLinkToBeEnabled(
    rowSelector: number | string | RegExp,
    testId: string,
    isEnabled = true,
  ) {
    const expectation = expect(this.getItemNavigationLink(rowSelector, testId))

    /**
     * Link disable attribute is ignored by toBeEnabled assertion
     * https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-be-disabled
     */
    await (isEnabled
      ? expectation.not.toHaveAttribute('disabled')
      : expectation.toHaveAttribute('disabled', 'true'))
  }

  async expectNavigationItemsLinkEnabledStatus(
    status: NavigationItemLinkStatus = [true, false, false],
    rowSelector?: number | string | RegExp,
  ) {
    rowSelector = rowSelector || 0
    await this.expectItemNavigationLinkToBeEnabled(
      rowSelector,
      NavigationLinksButton.Read,
      status[navigationItemLinkStatusIndex[NavigationLinksButton.Read]],
    )
    await this.expectItemNavigationLinkToBeEnabled(
      rowSelector,
      NavigationLinksButton.Update,
      status[navigationItemLinkStatusIndex[NavigationLinksButton.Update]],
    )
    await this.expectItemNavigationLinkToBeEnabled(
      rowSelector,
      NavigationLinksButton.Delete,
      status[navigationItemLinkStatusIndex[NavigationLinksButton.Delete]],
    )
  }

  async navigateToItemPage(rowSelector: number | string | RegExp) {
    await this.openAndExpectDataTable()
    await this.getItemNavigationLink(
      rowSelector,
      NavigationLinksButton.Read,
    ).click()
    const itemPomConstructor = this.getItemPageClass()
    const itemPom = new itemPomConstructor(this.page)
    await itemPom.clickPageTab('media')
    await itemPom.expectAppDataCardToHaveTitle(itemPom.resourceItemLabel)
    return itemPom
  }

  async navigateToItemMediaTab(rowSelector: number | string | RegExp) {
    const itemPom = await this.navigateToItemPage(rowSelector)
    await itemPom.clickPageTab('media')
    return itemPom
  }
}
