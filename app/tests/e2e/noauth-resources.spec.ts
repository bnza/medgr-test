import { test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { SearchPage } from '@lib/pages/SearchPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
test.beforeAll(async () => {
  loadFixtures()
})

test.describe('Resources [no-auth]', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Collection (site) has expected navigation permissions', async ({
    page,
  }) => {
    const pom = new SiteCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectNavigationItemsLinkEnabledStatus()
  })
  test('Collection (site) can be ordered', async ({ page }) => {
    const pom = new SiteCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'name',
      '**/sites*',
    )
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'code',
      '**/sites*',
    )
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'ID',
      '**/sites*',
      'id',
    )
  })
  test('Collection (site) can navigate to item page', async ({ page }) => {
    const pom = new SiteCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.getItemNavigationLink('ED', NavigationLinksButton.Read).click()
    await pom.expectAppDataCardToHaveTitle(/Site\s/)
  })

  test('Collection (site) can search and clear search', async ({ page }) => {
    const pom = new SiteCollectionPage(page)
    const searchPom = new SearchPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectTableTotalItems(11)
    await pom.searchLinkButton.click()
    await searchPom.expectAppDataCardToHaveTitle('sites')
    await searchPom.expectAddFilterButtonToOpenDialog()
    await searchPom.selectProperty('description')
    await searchPom.selectOperator('contains')
    await searchPom.operandSingleInput.fill('uae')
    await searchPom.addFilterButton.click()
    await searchPom.submitFiltersButton.click()
    await pom.expectDataTable()
    await pom.expectTableTotalItems(5)
    await pom.searchLinkButton.click()
    await searchPom.clearFiltersButton.click()
    await searchPom.submitFiltersButton.click()
    await pom.expectTableTotalItems(11)
  })
  test('Collection (SU) has expected navigation permissions', async ({
    page,
  }) => {
    const pom = new StratigraphicUnitCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectNavigationItemsLinkEnabledStatus()
  })

  test('Collection (SU) can be ordered', async ({ page }) => {
    const pom = new StratigraphicUnitCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'number',
      '**/stratigraphic_units*',
    )
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'year',
      '**/stratigraphic_units*',
    )
    await pom.expectClickTableHeaderToSendOrderCollectionRequest(
      'ID',
      '**/stratigraphic_units*',
      'id',
    )
  })
  test('Collection (SU) can navigate to item page', async ({ page }) => {
    const pom = new StratigraphicUnitCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.getItemNavigationLink(0, NavigationLinksButton.Read).click()
    await pom.expectAppDataCardToHaveTitle(/Stratigraphic\sUnit/)
  })
})
