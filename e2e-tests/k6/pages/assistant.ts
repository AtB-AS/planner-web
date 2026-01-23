import { Locator, Page } from 'k6/browser';

export class Assistant {
  constructor(private page: Page) {}

  // ### Return test-id locators ####
  get findTravelsButton(): Locator {
    return this.page.locator('[data-testid="findTravelsButton"]');
  }
  get loadMoreResultsButton(): Locator {
    return this.page.locator('[data-testid="loadMoreButton"]');
  }
  get tripDetails(): Locator {
    return this.page.locator('[data-testid="tripDetails"]');
  }
  get moreDetails(): Locator {
    return this.page.locator('[data-testid="moreDetailsButton"]');
  }
  private get firstDayLabel(): Locator {
    return this.page.locator('[data-testid="dayLabel"]').first();
  }
  getTrip(index: number = 0): Locator {
    return this.page.locator('[data-testid="tripPattern"]').nth(index);
  }

  // Return the day label, e.g. "Today" and "Tomorrow"
  async getFirstDayLabel() {
    const label = this.firstDayLabel;
    await label.waitFor({ state: 'visible' });
    return ((await label.textContent()) ?? '').trim();
  }

  // Return the price info for a trip
  async getTripPrice() {
    const trip = this.getTrip();
    const price = trip.locator('[data-testid="price"]');
    await price.waitFor({ state: 'visible' });
    return ((await price.textContent()) ?? '').trim();
  }

  // Get expected start time for a trip pattern (default: first trip)
  async getTripStartTime(index: number = 0) {
    const trip = this.page.locator(`[data-testid="tripPattern"]`).nth(index);
    const startTime = trip.locator('[data-testid="expStartTime"]').first();
    await startTime.waitFor({ state: 'visible' });
    return ((await startTime.textContent()) ?? '').trim();
  }

  // Get expected end time for a trip pattern (default: first trip)
  async getTripEndTime(index: number = 0) {
    const trip = this.page.locator(`[data-testid="tripPattern"]`).nth(index);
    const endTime = trip.locator('[data-testid="expEndTime"]').first();
    await endTime.waitFor({ state: 'visible' });
    return ((await endTime.textContent()) ?? '').trim();
  }
}
