import { test, expect } from '@playwright/test';

test.use({
  geolocation: { longitude: 62.4722, latitude: 6.1495 },
  permissions: ['geolocation'],
});

test.describe('fram only', () => {
  test.skip(
    () => process.env.NEXT_PUBLIC_PLANNER_ORG_ID !== 'fram',
    'Only FRAM!',
  );

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

    await page.getByRole('button', { name: 'Filter' }).click();

    await tripResponse;

    await page.getByPlaceholder('line number').click();
    await page.getByPlaceholder('line number').fill('701');

    const tripResponse2 = page.waitForResponse((request) => {
      return request.url().includes('assistant/trip');
    });
    await page.getByRole('button', { name: 'Find departures' }).click();
    await tripResponse2;

    const tripPatternItem2 = page.getByTestId('tripPattern-0-0');
    await tripPatternItem2.waitFor();

    await expect(tripPatternItem2).toBeVisible();
    expect(await tripPatternItem2.getAttribute('aria-label')).toContain('701');
  });

  test('should show boats and message on Correspondance', async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Moa trafikktermin');
    await page.getByRole('option', { name: 'Moa trafikkterminal' }).click();

    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Ulsteinvik');

    const additionalRequest = page.waitForResponse((request) => {
      return request.url().includes('trip');
    });

    await page
      .getByRole('option', { name: 'Ulsteinvik Ulstein', exact: true })
      .click();

    await additionalRequest;

    await page.getByTestId('tripPattern-0-0').waitFor();

    await page.getByRole('button', { name: 'Filter' }).click();

    const additionalRequest2 = page.waitForResponse((request) => {
      return (
        request.url().includes('trip') && request.url().includes('expressboat')
      );
    });
    await page.locator('label').filter({ hasText: 'Express boat' }).click();
    await page.getByText('Bus', { exact: true }).click();

    await page.getByText('Loading travel suggestions...').waitFor();

    await additionalRequest2;

    await page.getByText('1145').first().click();
    await expect(page.getByText('Correspondance between 1145')).toBeVisible();
  });
});
