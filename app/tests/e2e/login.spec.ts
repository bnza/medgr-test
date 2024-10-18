import { test, expect } from '@playwright/test'
import { loadFixtures } from '@lib/api'
import { LoginPage } from '@lib/pages/LoginPage'
import { HomePage } from '@lib/pages/HomePage'
test.beforeAll(async () => {
  loadFixtures()
})
test.describe('Login page', () => {
  test('Login redirection works as expected', async ({ page }) => {
    const homePom = new HomePage(page)
    const pom = new LoginPage(page)
    await homePom.open()
    await homePom.clickAppNavigationDrawerListItem([
      'app-navigation-drawer-li-about',
    ])
    await expect(homePom.page.getByTestId('app-layout')).toHaveText(
      /About page/,
    )
    await pom.loginButton.click()
    await pom.login()
    await expect(homePom.page.getByTestId('app-layout')).toHaveText(
      /About page/,
    )
  })
})
