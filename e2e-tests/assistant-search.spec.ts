import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 62.4722, latitude: 6.1495 },

  permissions: ['geolocation'],
});

test.describe('Trip search from different timezones.', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  });

  test.use({
    timezoneId: 'Europe/Oslo',
  });
  test('UTC - Europe/Oslo', async ({ page }) => {
    const searchTime = '14:30';
    const expectedDeparture = '15:00 -';
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
    await page
      .getByRole('option', { name: 'Kristiansund trafikkterminal' })
      .click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Molde');
    await page
      .getByRole('option', {
        name: 'Molde trafikkterminal',
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: 'Europe/Helsinki',
  });
  test('EET - Europe/Helsinki', async ({ page }) => {
    const searchTime = '14:30';
    const expectedDeparture = '15:00 -';
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
    await page
      .getByRole('option', { name: 'Kristiansund trafikkterminal' })
      .click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Molde');
    await page
      .getByRole('option', {
        name: 'Molde trafikkterminal',
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });

  test.use({
    timezoneId: 'Asia/Tokyo',
  });
  test('Asia/Tokyo ', async ({ page }) => {
    const searchTime = '14:30';
    const expectedDeparture = '15:00 -';
    await page.getByTestId('searchTimeSelector-departBy').click();
    await page.getByTestId('searchTimeSelector-time').click();
    await page.getByTestId('searchTimeSelector-time').fill(searchTime);
    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
    await page
      .getByRole('option', { name: 'Kristiansund trafikkterminal' })
      .click();
    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Molde');
    await page
      .getByRole('option', {
        name: 'Molde trafikkterminal',
      })
      .click();
    await page.getByTestId('tripPattern-0-0').click();
    const elementText = await page
      .getByTestId('detailsHeader-duration')
      .textContent();

    expect(elementText?.includes(expectedDeparture));
  });
});
