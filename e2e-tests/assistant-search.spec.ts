import { FALLBACK_LANGUAGE } from '@atb/translations/commons';
import { test, expect, type Page } from '@playwright/test';

const timezones = [
  { id: 'Asia/Tokyo', label: 'UTC +0900' },
  { id: 'Europe/Helsinki', label: 'UTC +0200' },
  { id: 'Europe/Oslo', label: 'UTC +0100' },
  { id: 'Europe/London', label: 'UTC +0000' },
  { id: 'America/Los_Angeles', label: 'UTC -0800' },
  { id: 'Asia/Kolkata', label: 'UTC +0550' },
];

const fromTextbox = 'Kristiansund';
const fromOption = 'Kristiansund trafikkterminal';
const toTextbox = 'Molde';
const toOption = 'Molde trafikkterminal';
const searchTime = '15:30';

function localTimeCET() {
  return new Date().toLocaleTimeString(FALLBACK_LANGUAGE, {
    timeZone: 'Europe/Oslo',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toMinutes(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

// True if the difference between time1 and time2 is less than 60 minutes.
function sameTimezone(time1: string, time2: string): boolean {
  return Math.abs(toMinutes(time1) - toMinutes(time2)) < 60;
}

async function getSelectedTime(page: Page): Promise<string> {
  const hour = await page.getByTestId('time-hour').textContent();
  const minute = await page.getByTestId('time-minute').textContent();
  return `${hour}:${minute}`;
}

async function setSelectedTime(page: Page, time: string) {
  await page.getByTestId('time-hour').click();
  await page.keyboard.type(time.replace(':', ''));
  await expect.poll(() => getSelectedTime(page)).toBe(time);
}

for (const timezone of timezones) {
  test.describe(`${timezone.id} - (${timezone.label})`, () => {
    test.use({ timezoneId: timezone.id });

    test.beforeEach(async ({ page }) => {
      await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
      await page.getByTestId('searchTimeSelector-leaveat').click();
    });

    test('Trip search departs after the selected time in CET', async ({
      page,
    }) => {
      await setSelectedTime(page, searchTime);

      await page.getByRole('textbox', { name: 'From' }).click();
      await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
      await page.getByRole('option', { name: fromOption }).click();
      await page.getByRole('textbox', { name: 'To' }).click();
      await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
      await page.getByRole('option', { name: toOption }).click();

      const firstTrip = page.getByTestId('tripPattern').first();
      await expect(firstTrip).toBeVisible({ timeout: 30_000 });

      const summary = (await firstTrip.getAttribute('aria-label')) ?? '';
      const startTime = summary.match(/Start time \D*(\d{2}:\d{2})/)?.[1];
      expect(startTime).toBeDefined();

      const minutesAfterSearch = toMinutes(startTime!) - toMinutes(searchTime);
      expect(minutesAfterSearch).toBeGreaterThanOrEqual(0);
      expect(minutesAfterSearch).toBeLessThan(120);
    });

    test('Default departure time is current time in CET', async ({ page }) => {
      const departureTime = await getSelectedTime(page);
      expect(sameTimezone(localTimeCET(), departureTime)).toBeTruthy();
    });
  });
}
