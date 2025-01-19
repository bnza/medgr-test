import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'

export default class DatePicker extends AbstractLocatorWrapper {
  async selectDate(year: string, month: string, day: string): Promise<void> {
    await this.locator.getByRole('button', { name: year, exact: true }).click()
    await this.locator.getByRole('button', { name: month, exact: true }).click()
    await this.locator.getByRole('button', { name: day, exact: true }).click()
  }
}
