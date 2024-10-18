import { expect, test } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { SiteCollectionPage } from '@lib/pages/SiteCollectionPage'
import { NavigationLinksButton } from '@lib/index'
test.beforeAll(async () => {
  loadFixtures()
})
test.describe('Site [no-auth]', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Collection has expected navigation permissions', async ({ page }) => {
    const pom = new SiteCollectionPage(page)
    await pom.openAndExpectDataTable()
    await pom.expectItemNavigationLinkToBeEnabled(0, NavigationLinksButton.Read)
    await pom.expectItemNavigationLinkToBeEnabled(
      0,
      NavigationLinksButton.Update,
      false,
    )
    await pom.expectItemNavigationLinkToBeEnabled(
      0,
      NavigationLinksButton.Delete,
      false,
    )
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
})
