import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 62.4722, latitude: 6.1495 },
  permissions: ['geolocation'],
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
  await page.getByRole('button', { name: 'Find journey' }).click();

  const tripPatternItem = page.getByTestId('tripPattern-0-0');
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
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshuset i Møre');
  await page
    .getByRole('option', { name: 'Fylkeshuset i Møre og Romsdal' })
    .click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.waitForResponse((request) => {
    return request.url().includes('assistant/non-transit-trip');
  });

  await page.getByTestId('non-transit-pill-foot').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset i Møre og Romsdal' }),
  ).toBeVisible();
});

test('should show non transit trips on cyclable distance', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshuset i Møre');
  await page
    .getByRole('option', { name: 'Fylkeshuset i Møre og Romsdal' })
    .click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.waitForResponse((request) => {
    return request.url().includes('assistant/non-transit-trip');
  });

  await page.getByTestId('non-transit-pill-bicycle').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset i Møre og Romsdal' }),
  ).toBeVisible();
});
