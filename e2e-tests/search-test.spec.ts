import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'From' }).click();
  await page.getByRole('textbox', { name: 'From' }).fill('Kristiansund');
  await page.getByRole('option', { name: 'Kristiansund Kristiansund' }).click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).click();
  await page.getByRole('textbox', { name: 'To' }).fill('Molde');
  await page.getByRole('option', { name: 'Molde Molde', exact: true }).click();
  await page.getByRole('button', { name: 'More choices' }).click();
  await page.getByText('Bus', { exact: true }).click();
  await page.getByRole('button', { name: 'Find departures' }).click();
  await page.getByRole('button', { name: 'Load more results' }).click();
});
