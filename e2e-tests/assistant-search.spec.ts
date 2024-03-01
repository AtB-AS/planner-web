import { test, expect } from '@playwright/test';

const JST = 'Asia/Tokyo';
const EET = 'Europe/Helsinki';
const CTU = 'Europe/Oslo';
const UTC = 'Europe/London';
const PST = 'America/Los_Angeles';

const fromTextbox = 'Kristiansund';
const fromOption = 'Kristiansund trafikkterminal';
const toTextbox = 'Molde';
const toOption = 'Molde trafikkterminal';
const searchTime = '15:30';
const expectedDeparture = '16:00 -';

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
    timezoneId: CTU,
  });
  test(CTU + ' - (UTC +0100)', async ({ page }) => {
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
