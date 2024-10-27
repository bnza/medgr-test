import { Locator } from '@playwright/test'

export default abstract class AbstractLocatorWrapper {
  constructor(public readonly locator: Locator) {}
}
