import { test, expect } from '@playwright/test';

test('Test fetching Kristiansund - Molde and loading more after first result', async ({
  page,
}) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
  await page.getByRole('option', { name: 'Kristiansund Kristiansund' }).click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).click();

  await page.getByRole('textbox', { name: 'To' }).fill('Molde');
  await page.getByRole('option', { name: 'Molde Molde', exact: true }).click();
  await page.getByRole('button', { name: 'More choices' }).click();

  // let tripPromise = page.waitForResponse(/api\/assistant\/trip/);
  await page.getByText('Bus', { exact: true }).click();
  await page.getByRole('button', { name: 'Find departures' }).click();

  const orderSent = page.getByTestId('trip-pattern-0');

  await orderSent.waitFor();

  await page.getByRole('button', { name: 'Load more results' }).click();
});
