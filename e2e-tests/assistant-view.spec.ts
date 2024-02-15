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
  await page.getByRole('option', { name: 'Kristiansund Kristiansund' }).click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Molde');
  await page.getByRole('option', { name: 'Molde Molde', exact: true }).click();

  await page.getByRole('button', { name: 'More choices' }).click();
  await page.getByText('Bus', { exact: true }).click();
  await page.getByRole('button', { name: 'Find departures' }).click();

  const tripPatternItem = page.getByTestId('trip-pattern-0');
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
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshus');
  await page
    .getByRole('option', { name: 'Fylkeshuset i Møre og Romsdal' })
    .click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.getByTestId('non-transit-pill-foot').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset i Møre og Romsdal' }),
  ).toBeVisible();
});

test('should show non transit trips on cyclable distance', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Fylkeshus');
  await page
    .getByRole('option', { name: 'Fylkeshuset i Møre og Romsdal' })
    .click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Roseby');
  await page.getByRole('option', { name: 'Roseby Molde', exact: true }).click();

  await page.getByTestId('non-transit-pill-bicycle').click();

  await expect(
    page.getByRole('heading', { name: 'Fylkeshuset i Møre og Romsdal' }),
  ).toBeVisible();
});

test('should show boats and message on Correspondance', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Moa trafikktermin');
  await page.getByText('Moa trafikkterminal').click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Ulsteinvik');

  const additionalRequest = page.waitForResponse((request) => {
    return request.url().includes('trip');
  });

  await page.getByRole('option', { name: 'Ulsteinvik Ulstein' }).click();

  await additionalRequest;

  await page.getByRole('button', { name: 'More choices' }).click();

  const additionalRequest2 = page.waitForResponse((request) => {
    return (
      request.url().includes('trip') && request.url().includes('expressboat')
    );
  });
  await page.locator('label').filter({ hasText: 'Express boat' }).click();

  await additionalRequest2;

  await page.getByTestId('trip-pattern-1').click();
  await expect(page.getByText('Correspondance between 1145')).toBeVisible();
});
