import { Locator, Page } from 'k6/browser';

export class TimeSelector {
  constructor(private page: Page) {}

  // ### Return test-id locators ####
  private get timeHours(): Locator {
    return this.page.locator('[data-testid="time-hour"]');
  }
  private get timeMinutes(): Locator {
    return this.page.locator('[data-testid="time-minute"]');
  }
  private get calendar(): Locator {
    return this.page.locator('[data-testid="calendarButton"]');
  }

  // Set departure time: hours
  private async setHours(hours: string) {
    const hour = this.timeHours;
    await hour.focus();
    await this.page.keyboard.type(hours);
  }

  // Set departure time: minutes
  private async setMinutes(minutes: string) {
    const min = this.timeMinutes;
    await min.focus();
    await this.page.keyboard.type(minutes);
  }

  // Set search/departure time
  async setTime(targetTime: string) {
    await this.setHours(targetTime.split(':')[0]);
    await this.setMinutes(targetTime.split(':')[1]);
  }

  // Select type of search
  async selectSearch(search: 'leavenow' | 'leaveat' | 'arriveby') {
    const selector = this.page.locator(
      `[data-testid="searchTimeSelector-${search}"]`,
    );
    await selector.waitFor();
    await selector.click();
  }

  // Open the calendar
  async openCalendar() {
    const calendar = this.calendar;
    await calendar.waitFor({ state: 'visible' });
    await calendar.click();
  }

  // Change to previous or next month in the calendar
  async changeMonth(change: 'previous' | 'next') {
    const button = this.page.locator(`[data-testid="${change}MonthButton"]`);
    await button.waitFor();
    await button.click();
  }

  // Set search/departure date
  async setDate(targetDate: string) {
    const date = this.page.locator(`[data-testid="date-${targetDate}"]`);
    await date.waitFor();
    await date.click();
  }
}
