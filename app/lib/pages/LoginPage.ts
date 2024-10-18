import { BasePage } from '@lib/pages/BasePage'

export class LoginPage extends BasePage {
  protected readonly path = '/login'
  public readonly getDataCard = this.page.getByTestId('login-data-card')
  public readonly getEmailInput = this.page.getByLabel('e-mail')
  public readonly getPasswordInput = this.page.getByLabel('password')
  public readonly getLoginButton = this.page.getByRole('button', {
    name: 'login',
  })

  async login(
    credentials = { email: 'user_base@example.com', password: '0000' },
  ) {
    await this.getEmailInput.fill(credentials.email)
    await this.getPasswordInput.fill(credentials.password)
    await this.getLoginButton.click()
    await this.expectAppSnackbarToHaveText(/successfully logged in/)
  }
}
