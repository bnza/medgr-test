import { test as setup, expect } from '@playwright/test'
import { LoginPage } from '@lib/pages/LoginPage'
import { loadFixtures, credentials } from '@lib/api'

setup.beforeAll(() => {
  loadFixtures()
})

const adminFile = 'playwright/.auth/admin.json'

setup('authenticate as admin ser', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.ADMIN)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: adminFile })
})

const editorFile = 'playwright/.auth/editor.json'
setup('authenticate as editor user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.EDITOR)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: editorFile })
})

const baseFile = 'playwright/.auth/base.json'
setup('authenticate as base user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.BASE)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: baseFile })
})

const geoFile = 'playwright/.auth/geo.json'
setup('authenticate as geo archaeologist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.GEO)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: geoFile })
})
