import { test, expect } from '@playwright/test';

test('Test fetching Kristiansund - Molde and loading more after first result', async ({
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

test('Should filter on line 701', async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Kvam');
  await page.getByRole('option', { name: 'Kvam skole Molde' }).click();

  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Fylkeshusa');

  const tripResponse = page.waitForResponse((request) => {
    return request.url().includes('assistant/trip');
  });
  await page.getByRole('option', { name: 'Fylkeshusa Molde' }).click();

  await page.getByRole('button', { name: 'More choices' }).click();

  await tripResponse;

  await page.getByPlaceholder('line number').click();
  await page.getByPlaceholder('line number').fill('701');

  const tripResponse2 = page.waitForResponse((request) => {
    return request.url().includes('assistant/trip');
  });
  await page.getByRole('button', { name: 'Find departures' }).click();
  await tripResponse2;

  const tripPatternItem2 = page.getByTestId('trip-pattern-0');
  await tripPatternItem2.waitFor();

  await expect(tripPatternItem2).toBeVisible();
  expect(await tripPatternItem2.getAttribute('aria-label')).toContain('701');
});
