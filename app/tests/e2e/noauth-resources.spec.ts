import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { NavigationLinksButton } from '@lib/index'
import { SearchPage } from '@lib/pages/SearchPage'
import { MicroStratigraphicUnitCollectionPage } from '@lib/pages/MicroStratigraphicUnitCollectionPage'
import { SampleCollectionPage } from '@lib/pages/SampleCollectionPage'
import { StratigraphicUnitCollectionPage } from '@lib/pages/StratigraphicUnitCollectionPage'
import { StratigraphicUnitItemPage } from '@lib/pages/StratigraphicUnitItemPage'
import InfoBox from '@lib/locators/InfoBox'
import { SiteItemPage } from '@lib/pages/SiteItemPage'
test.beforeAll(async () => {
  loadFixtures()
})

test.describe('Resources [no-auth]', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.describe('media', () => {
    test('Media tab works as expected', async ({ page }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.getItemNavigationLink(0, NavigationLinksButton.Read).click()
      await pom.expectAppDataCardToHaveTitle(/Stratigraphic\sUnit/)
      const itemPom = new StratigraphicUnitItemPage(page)
      await itemPom.clickPageTab('media')
      await itemPom.mediaObjectContainer.expectMediaCardsCount(1)
      await itemPom.mediaObjectContainer.expectToBeReadonly()
      await itemPom.clickBackButton()
      await pom.getItemNavigationLink(1, NavigationLinksButton.Read).click()
      await itemPom.mediaObjectContainer.expectNoMediaFound()
    })
  })

  test.describe('MU', () => {
    test('Collection has expected navigation permissions', async ({ page }) => {
      const pom = new MicroStratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectNavigationItemsLinkEnabledStatus()
      await expect(pom.downloadResourceButton).toHaveCount(0)
    })
    test('Collection can navigate to item page', async ({ page }) => {
      const pom = new MicroStratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.getItemNavigationLink(0, NavigationLinksButton.Read).click()
      await pom.expectAppDataCardToHaveTitle(/Microstratigraphic\sUnit/)
    })
  })

  test.describe('site', () => {
    test('Collection has expected navigation permissions', async ({ page }) => {
      const pom = new SiteCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectNavigationItemsLinkEnabledStatus()
      await expect(pom.downloadResourceButton).toHaveCount(0)
    })
    test('Collection can be ordered', async ({ page }) => {
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
    test('Collection can navigate to item page', async ({ page }) => {
      const pom = new SiteCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.getItemNavigationLink('ED', NavigationLinksButton.Read).click()
      await pom.expectAppDataCardToHaveTitle(/Site\s/)
    })

    test('Collection can search and clear search', async ({ page }) => {
      const pom = new SiteCollectionPage(page)
      const searchPom = new SearchPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectTableTotalItems(11)
      await pom.simpleFilter()
      await pom.expectTableTotalItems(5)
      await pom.searchLinkButton.click()
      await searchPom.clearFiltersButton.click()
      await searchPom.submitFiltersButton.click()
      await pom.expectTableTotalItems(11)
    })
  })

  test.describe('sample', () => {
    test("Collection SU's info box works as expected", async ({ page }) => {
      const pom = new SampleCollectionPage(page)
      const suItemPom = new StratigraphicUnitItemPage(page)
      const siteItemPom = new SiteItemPage(page)
      await pom.openAndExpectDataTable()
      await pom.dataCollectionTable.getByTestId('info-box-chip').nth(0).click()
      const infoBoxLocator = new InfoBox(page.getByTestId('info-box-card'))
      await infoBoxLocator.expectTitle('Stratigraphic Unit')
      await infoBoxLocator.expectContentContains(/alluvial deposit/)
      await infoBoxLocator.expectViewButtonIsEnabled()
      await infoBoxLocator.viewButtons.click()
      await suItemPom.expectDataPage()
      await page.getByTestId('data-info-box-activator').click()
      await infoBoxLocator.expectTitle('Site')
      await infoBoxLocator.expectContentContains(/Al Naslaa/)
      await infoBoxLocator.expectViewButtonIsEnabled()
      await infoBoxLocator.viewButtons.click()
      await siteItemPom.expectDataPage()
      await siteItemPom.clickBackButton()
      await suItemPom.expectDataPage()
      await suItemPom.clickBackButton()
      await pom.expectDataTable()
    })
  })

  test.describe('SU', () => {
    test('Collection has expected navigation permissions', async ({ page }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.expectNavigationItemsLinkEnabledStatus()
      await expect(pom.downloadResourceButton).toHaveCount(0)
    })
    test('Collection can be ordered', async ({ page }) => {
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
    test('Collection can navigate to item page', async ({ page }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.getItemNavigationLink(0, NavigationLinksButton.Read).click()
      await pom.expectAppDataCardToHaveTitle(/Stratigraphic\sUnit/)
    })
    test("Collection site's info box works as expected", async ({ page }) => {
      const pom = new StratigraphicUnitCollectionPage(page)
      await pom.openAndExpectDataTable()
      await pom.dataCollectionTable.getByTestId('info-box-chip').nth(0).click()
      const infoBoxLocator = new InfoBox(page.getByTestId('info-box-card'))
      await infoBoxLocator.expectTitle('Site')
      await infoBoxLocator.expectContentContains(/Al Naslaa/)
      await infoBoxLocator.expectViewButtonIsEnabled()
    })
  })
})
