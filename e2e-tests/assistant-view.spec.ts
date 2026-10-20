import { test, expect } from '@playwright/test';

test.use({
  geolocation: { latitude: 62.4722, longitude: 6.1495 },
  permissions: ['geolocation'],
});

// Autocomplete defaults to only showing stop places, but these tests
// search for localities and addresses.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('onlyStopPlaces', 'false');
  });
});

test('Should fetch Kristiansund - Molde and loading more after first result', async ({
  page,
}) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
  await page
    .getByRole('option', { name: 'Kristiansund Kristiansund', exact: true })
    .click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Molde');

  const initialRequest = page.waitForResponse((request) => {
    return request.url().includes('trip') && request.url().includes('cursor');
  });

  await page.getByRole('option', { name: 'Molde Molde', exact: true }).click();

  await initialRequest;

  await page.getByRole('button', { name: 'Filter' }).click();
  await page.getByText('Bus', { exact: true }).click();
  await page.getByRole('button', { name: 'Find trip' }).click();

  const tripPatternItem = page.getByTestId('tripPattern').first();
  await tripPatternItem.waitFor();

  const additionalRequest = page.waitForRequest((request) => {
    return request.url().includes('trip') && request.url().includes('cursor');
  });
  await page.getByRole('button', { name: 'Load more results' }).click();

  await additionalRequest;
});

test('should show non transit trips on walkable distance', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshuset');
  await page
    .getByRole('option', { name: 'Fylkeshuset Molde', exact: true })
    .click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.waitForResponse((request) => {
    return request.url().includes('assistant/non-transit-trip');
  });

  await page.getByTestId('non-transit-pill-foot').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset - Roseby' }),
  ).toBeVisible();
});

test('should show non transit trips on cyclable distance', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshuset');
  await page
    .getByRole('option', { name: 'Fylkeshuset Molde', exact: true })
    .click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.waitForResponse((request) => {
    return request.url().includes('assistant/non-transit-trip');
  });

  await page.getByTestId('non-transit-pill-bicycle').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset - Roseby' }),
  ).toBeVisible();
});
