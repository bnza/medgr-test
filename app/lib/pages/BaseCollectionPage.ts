import { BasePage } from '@lib/pages/BasePage'
import { expect } from '@playwright/test'

export abstract class BaseCollectionPage extends BasePage {
  public abstract readonly resourceCollectionLabel: string | RegExp

  public readonly dataCollectionTable = this.page.getByTestId(
    'data-collection-table',
  )
  public readonly idHeader = this.page.getByRole('cell', {
    name: 'ID',
    exact: true,
  })

  public readonly searchLink = this.page.getByTestId('collection-search-link')

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

  async openAndExpectDataTable() {
    await this.open()
    await this.expectDataTable()
  }
  async expectDataTable() {
    await this.expectAppDataCardToHaveTitle(this.resourceCollectionLabel)
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
}
