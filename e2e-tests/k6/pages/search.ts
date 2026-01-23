import { Locator, Page } from 'k6/browser';
import { sleep } from 'k6';
import { getFromLocationName, getToLocationName } from '../data/locations.ts';
import { Assistant } from './assistant.ts';

export class Search {
  constructor(private page: Page) {}

  // ### Return test-id locators ####
  private get searchFromField(): Locator {
    return this.page.locator('[data-testid="searchFrom"]');
  }
  private get searchToField(): Locator {
    return this.page.locator('[data-testid="searchTo"]');
  }
  private searchOptionField(layer: 'venue' | 'address' = 'venue'): Locator {
    return this.page.locator(`[data-testid="list-item-${layer}"]`).first();
  }
  private get swapButton(): Locator {
    return this.page.locator('[data-testid="swapButton"]');
  }
  private get onlyStopPlacesCheckbox(): Locator {
    return this.page.locator('[data-testid="onlyStopPlacesCheckbox"]');
  }

  // Return location in the search from input
  async fromLocation() {
    const from = this.page.locator('[data-testid="searchFrom"]');
    return ((await from.getAttribute('value')) ?? '').trim();
  }

  // Return location in the search to input
  async toLocation() {
    const to = this.page.locator('[data-testid="searchTo"]');
    return ((await to.getAttribute('value')) ?? '').trim();
  }

  // Do a random search from the list of options
  async doRandomSearch() {
    const fromLocation = getFromLocationName();
    const toLocation = getToLocationName();

    await Promise.all([
      this.page.waitForNavigation(),
      await this.searchFrom(fromLocation),
      await this.searchTo(toLocation),
      await this.swapLocationsIfDisabled(),
    ]);
  }

  // Do a search from @fromLocation to @toLocation
  async doSearch(fromLocation: string, toLocation: string) {
    await Promise.all([
      this.page.waitForNavigation(),
      await this.searchFrom(fromLocation),
      await this.searchTo(toLocation),
      await this.swapLocationsIfDisabled(),
    ]);
  }

  // Search from a location (venue aka stop place or address)
  async searchFrom(location: string, layer: 'venue' | 'address' = 'venue') {
    await this.searchFromField.click();
    await this.searchFromField.type(location);
    if (layer === 'address') {
      const checkbox = this.onlyStopPlacesCheckbox;
      await checkbox.waitFor({ state: 'visible' });
      await checkbox.uncheck();
    }
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForNavigation(),
      this.searchOptionField(layer).click(),
    ]);
    await this.page.waitForTimeout(1000);

    // To avoid an error where the search from is not sent
    const inputText = await this.searchFromField.inputValue();
    if (!inputText || !inputText.includes(location)) {
      await this.searchFrom(location);
    }
  }

  // Search to a location (stop place)
  async searchTo(location: string) {
    await this.searchToField.click();
    await this.searchToField.type(location);
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForNavigation(),
      this.searchOptionField().click(),
    ]);
  }

  // Fallback. Sometimes the search isn't started after to-location is entered.
  // Try to swap to/from locations.
  async swapLocationsIfDisabled() {
    let counter = 0;
    const assistant = new Assistant(this.page);
    // Wait 1 sec and check every 100 ms
    while (!(await assistant.findTravelsButton.isEnabled()) && counter < 10) {
      sleep(0.1);
      counter++;
    }
    // Swap if disabled after 1 sec
    if (!(await assistant.findTravelsButton.isEnabled())) {
      await this.swapButton.click();
    }
  }
}
