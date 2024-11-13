import AbstractLocatorWrapper from '@lib/locators/AbstractLocatorWrapper'
import { expect, Locator } from '@playwright/test'

type RelationshipTypes =
  | 'cover to'
  | 'covered by'
  | 'cuts'
  | 'cut by'
  | 'fill to'
  | 'filled by'
  | 'same as'
export default class StratigraphicUnitsRelationshipContainer extends AbstractLocatorWrapper {
  readonly suRelationshipCards: Locator = this.locator.getByTestId(
    'su-relationship-card',
  )
  readonly enableEditingButton: Locator = this.locator.getByTestId(
    'enable-editing-button',
  )

  readonly deleteRelationshipDialog: Locator = this.locator
    .page()
    .getByTestId('delete-su-relationship-card')

  readonly createRelationshipDialog: Locator = this.locator
    .page()
    .getByTestId('add-su-relationship-card')

  readonly createMediaObjectDialog: Locator = this.locator.getByTestId(
    'create-media-object-card',
  )

  getSuRelationshipCard(type: RelationshipTypes) {
    return this.suRelationshipCards.filter({ hasText: type })
  }

  getSuRelationshipChips(type: RelationshipTypes) {
    return this.getSuRelationshipCard(type).getByTestId('su-relationship-chip')
  }

  getSuRelationshipChip(
    type: RelationshipTypes,
    selector: number | string | RegExp,
  ) {
    const chips = this.getSuRelationshipChips(type)
    if ('number' === typeof selector) {
      return chips.nth(selector)
    }
    return chips.filter({ hasText: selector })
  }
  clickAddRelationshipButton(type: RelationshipTypes) {
    return this.getSuRelationshipCard(type)
      .getByTestId('add-relationship-button')
      .click()
  }

  async fillCreateRelationship(text: string, optionNth: number = 0) {
    const requestPromise = this.locator
      .page()
      .waitForRequest('**/stratigraphic_units*')
    await this.createRelationshipDialog
      .getByLabel('stratigraphic unit')
      .fill(text)
    await requestPromise
    await this.locator.page().getByRole('option').nth(optionNth).click()
  }

  async submitCreateRelationship(text: string, optionNth: number = 0) {
    await this.fillCreateRelationship(text, optionNth)
    await this.createRelationshipDialog
      .getByRole('button', { name: 'submit' })
      .click()
  }
  async expectToBeReadonly() {
    for (const suRelationshipCard of await this.suRelationshipCards.all()) {
      await expect(
        suRelationshipCard.getByTestId('add-relationship-button'),
      ).toHaveCount(0)
      for (const suRelationshipChip of await suRelationshipCard
        .getByTestId('su-relationship-chip')
        .all()) {
        await expect(
          suRelationshipChip.getByTestId('delete-relationship-button'),
        ).toHaveCount(0)
      }
    }
  }
  async expectToBeEditable() {
    for (const suRelationshipCard of await this.suRelationshipCards.all()) {
      await expect(
        suRelationshipCard.getByTestId('add-relationship-button'),
      ).not.toHaveCount(0)
      for (const suRelationshipChip of await suRelationshipCard
        .getByTestId('su-relationship-chip')
        .all()) {
        await expect(
          suRelationshipChip.getByTestId('delete-relationship-button'),
        ).not.toHaveCount(0)
      }
    }
  }
  async expectCardToHaveChipsCount(type: RelationshipTypes, count: number) {
    await expect(this.getSuRelationshipChips(type)).toHaveCount(count)
  }
}
