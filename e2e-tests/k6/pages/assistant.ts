import { Locator, Page } from 'k6/browser';
import { testIdExists } from '../utils/utils.ts';

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
  get searchLoading(): Locator {
    return this.page.getByText('Loading travel suggestions...', {
      exact: true,
    });
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
    const price = this.page
      .locator('[data-testid="priceSummary_value"]')
      .first();
    await price.waitFor({ state: 'visible' });
    return ((await price.textContent()) ?? '').trim();
  }

  // Return the status for a trip (if it exists)
  async getTripStatus(index: number = 0) {
    const trip = this.page.locator(`[data-testid="tripPattern"]`).nth(index);
    const statusExists = await testIdExists(trip, 'tripStatus');
    if (!statusExists) {
      return 'NotFound';
    }
    const status = trip.locator('[data-testid="tripStatus"]');
    await status.waitFor({ state: 'visible' });
    return ((await status.textContent()) ?? '').trim();
  }

  // Get expected start time for a trip pattern (default: first trip)
  async getTripStartTime(index: number = 0) {
    const trip = this.page.locator(`[data-testid="tripPattern"]`).nth(index);
    const timeRange = trip.locator('[data-testid="expectedTimeRange"]').first();
    await timeRange.waitFor({ state: 'visible' });
    const startTime = (await timeRange.textContent())!.split(' ')[0];
    return startTime.trim();
  }

  // Get expected end time for a trip pattern (default: first trip)
  async getTripEndTime(index: number = 0) {
    const trip = this.page.locator(`[data-testid="tripPattern"]`).nth(index);
    const timeRange = trip.locator('[data-testid="expectedTimeRange"]').first();
    await timeRange.waitFor({ state: 'visible' });
    const timeArray = (await timeRange.textContent())!.split(' ');
    const endTime = timeArray[timeArray.length - 1];
    return endTime.trim();
  }
}
