import { Locator, Page } from 'k6/browser';

export class Departures {
  private page: Page;
  private searchFromField: Locator;
  private searchOptionField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchFromField = page.locator('[data-testid="searchFrom"]');
    this.searchOptionField = page.locator('[data-testid="list-item-0"]');
  }

  async searchFrom(location: string) {
    await this.searchFromField.click();
    await this.searchFromField.type(location);
    await this.searchOptionField.click();
  }

  getFirstDeparture(quay: string) {
    return this.page.locator(`[data-testid="departure-${quay}-0"]`);
  }
}