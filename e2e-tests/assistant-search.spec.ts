import { FALLBACK_LANGUAGE } from '@atb/translations/commons';
import { test, expect } from '@playwright/test';
import zonedTimeToUtc from 'date-fns';

const JST = 'Asia/Tokyo';
const EET = 'Europe/Helsinki';
const CET = 'Europe/Oslo';
const UTC = 'Europe/London';
const PST = 'America/Los_Angeles';

const fromTextbox = 'Kristiansund';
const fromOption = 'Kristiansund trafikkterminal';
const toTextbox = 'Molde';
const toOption = 'Molde trafikkterminal';
const searchTime = '15:30';
const expectedDeparture = '16:00 -';

const localTimeCET = new Date().toLocaleTimeString(FALLBACK_LANGUAGE, {
  timeZone: CET,
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
});

function timeDifferenceInMinutes(time1: string, time2: string): number {
  const [hour1, minute1] = time1.split(':').map(Number);
  const [hour2, minute2] = time2.split(':').map(Number);

  const totalMinutes1 = hour1 * 60 + minute1;
  const totalMinutes2 = hour2 * 60 + minute2;

  return Math.abs(totalMinutes1 - totalMinutes2);
}

// True if the difference between time1 and time2 is less than 60 minutes.
function sameTimezone(time1: string, time2: string): boolean {
  const minutesDifference = timeDifferenceInMinutes(time1, time2);
  return minutesDifference < 60;
}

test.describe('Trip search from different timezones - detailed view.', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  });

  test.use({
    timezoneId: JST,
  });
  test(JST + ' - (UTC +0900)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
    await page.getByRole('option', { name: fromOption }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
    await page
      .getByRole('option', {
        name: toOption,
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: EET,
  });
  test(EET + ' - (UTC +0200)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
    await page.getByRole('option', { name: fromOption }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
    await page
      .getByRole('option', {
        name: toOption,
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: CET,
  });
  test(CET + ' - (UTC +0100)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
    await page.getByRole('option', { name: fromOption }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
    await page
      .getByRole('option', {
        name: toOption,
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: UTC,
  });
  test(UTC + ' - (UTC +0000)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
    await page.getByRole('option', { name: fromOption }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
    await page
      .getByRole('option', {
        name: toOption,
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: PST,
  });
  test(PST + ' - (UTC -0800)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill(fromTextbox);
    await page.getByRole('option', { name: fromOption }).click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill(toTextbox);
    await page
      .getByRole('option', {
        name: toOption,
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });
});

test.describe('Adjusts for summer and winter time - detailed view.', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  });

  test.use({
    timezoneId: JST,
  });
  test(JST + ' - (UTC +0900)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    const departureTime = await page
      .getByTestId('searchTimeSelector-time')
      .inputValue();
    expect(sameTimezone(localTimeCET, departureTime)).toBeTruthy();
  });

  test.use({
    timezoneId: EET,
  });
  test(EET + ' - (UTC +0200)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    const departureTime = await page
      .getByTestId('searchTimeSelector-time')
      .inputValue();
    expect(sameTimezone(localTimeCET, departureTime)).toBeTruthy();
  });

  test.use({
    timezoneId: CET,
  });
  test(CET + ' - (UTC +0100)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    const departureTime = await page
      .getByTestId('searchTimeSelector-time')
      .inputValue();
    expect(sameTimezone(localTimeCET, departureTime)).toBeTruthy();
  });

  test.use({
    timezoneId: UTC,
  });
  test(UTC + ' - (UTC +0000)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    const departureTime = await page
      .getByTestId('searchTimeSelector-time')
      .inputValue();
    expect(sameTimezone(localTimeCET, departureTime)).toBeTruthy();
  });

  test.use({
    timezoneId: PST,
  });
  test(PST + ' - (UTC -0800)', async ({ page }) => {
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    const departureTime = await page
      .getByTestId('searchTimeSelector-time')
      .inputValue();
    expect(sameTimezone(localTimeCET, departureTime)).toBeTruthy();
  });
});
