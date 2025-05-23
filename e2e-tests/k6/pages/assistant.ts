import { Locator, Page } from 'k6/browser';
import { sleep } from 'k6';

export class Assistant {
  private page: Page;
  private searchFromField: Locator;
  private searchToField: Locator;
  private searchOptionField: Locator;
  private firstTrip: Locator;
  private loadMoreButton: Locator;
  private searchForTravelsButton: Locator;
  private swapButton: Locator;
  private tripDetails: Locator;
  private moreDetails: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchFromField = page.locator('[data-testid="searchFrom"]');
    this.searchToField = page.locator('[data-testid="searchTo"]');
    this.searchOptionField = page.locator('[data-testid="list-item-0"]');
    this.firstTrip = page.locator('[data-testid="tripPattern-0-0"]');
    this.loadMoreButton = page.locator('[data-testid="loadMoreButton"]');
    this.searchForTravelsButton = page.locator('[data-testid="findTravelsButton"]');
    this.swapButton = page.locator('[data-testid="swapButton"]');
    this.tripDetails = page.locator('[data-testid="tripDetails"]');
    this.moreDetails = page.locator('[data-testid="moreDetailsButton"]');
  }

  async searchFrom(location: string) {
    await this.searchFromField.click();
    await this.searchFromField.type(location);
    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.page.waitForNavigation(),
      this.searchOptionField.click(),
    ]);
    await this.page.waitForTimeout(1000);

    // To avoid an error where the search from is not sent
    const inputText = await this.searchFromField.inputValue();
    if (!inputText || !inputText.includes(location)) {
      await this.searchFrom(location);
    }
  }

  async searchTo(location: string) {
    await this.searchToField.click();
    await this.searchToField.type(location);
    await this.searchOptionField.click();
  }

  getFirstTrip() {
    return this.firstTrip;
  }

  getLoadMoreButton() {
    return this.loadMoreButton;
  }

  getTripDetails(){
    return this.tripDetails;
  }

  getMoreDetails(){
    return this.moreDetails;
  }

  // Fallback. Sometimes the search isn't started after to-location is entered.
  // Try to swap to/from locations.
  async swapLocationsIfDisabled() {
    let counter = 0
    // Wait 1 sec and check every 100 ms
    while (!await this.searchForTravelsButton.isEnabled() && counter < 10){
      sleep(0.1)
      counter++
    }
    // Swap if disabled after 1 sec
    if (!await this.searchForTravelsButton.isEnabled()) {
      await this.swapButton.click();
    }
  }
}
