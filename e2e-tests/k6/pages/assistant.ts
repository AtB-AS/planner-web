import { Locator, Page } from 'k6/browser';

export class Assistant {
  private page: Page;
  private searchFromField: Locator;
  private searchToField: Locator;
  private searchOptionField: Locator;
  private firstTrip: Locator;
  private loadMoreButton: Locator;

  private verificationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchFromField = page.locator('[data-testid="searchFrom"]');
    this.searchToField = page.locator('[data-testid="searchTo"]');
    this.searchOptionField = page.locator('[data-testid="list-item-0"]');
    //NOTE: If results are not found in first search the locator could be e.g. "tripPattern-1-0" or "tripPattern-2-0"
    this.firstTrip = page.locator('[data-testid="tripPattern-0-0"]');
    this.loadMoreButton = page.locator('[data-testid="loadMoreButton"]');

    this.verificationMessage = page.locator('.row.contact h2');
  }

  async searchFrom(location: string) {
    await this.searchFromField.click();
    await this.searchFromField.type(location);
    await Promise.all([
      this.page.waitForLoadState(),
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

  async getVerificationMessage() {
    return this.verificationMessage.innerText();
  }
}
