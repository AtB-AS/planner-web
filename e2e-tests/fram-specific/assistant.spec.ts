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

test.describe('fram only', () => {
  test.skip(
    () => process.env.NEXT_PUBLIC_PLANNER_ORG_ID !== 'fram',
    'Only FRAM!',
  );

  test('Should filter on line 701', async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Kvam skole');
    await page
      .getByRole('option', { name: 'Kvam skole Molde', exact: true })
      .click();

    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Fylkeshuset');

    const tripResponse = page.waitForResponse((request) => {
      return request.url().includes('assistant/trip');
    });
    await page
      .getByRole('option', { name: 'Fylkeshuset Molde', exact: true })
      .click();

    await page.getByRole('button', { name: 'Filter' }).click();

    await tripResponse;

    await page.getByRole('textbox', { name: 'Line' }).fill('701');

    const tripResponse2 = page.waitForResponse((request) => {
      return request.url().includes('assistant/trip');
    });
    await page.getByRole('button', { name: 'Find trip' }).click();
    await tripResponse2;

    const tripPatternItem2 = page.getByTestId('tripPattern').first();
    await tripPatternItem2.waitFor();

    await expect(tripPatternItem2).toBeVisible();
    expect(await tripPatternItem2.getAttribute('aria-label')).toContain('701');
  });

  test('should show boats and message on Correspondance', async ({ page }) => {
    await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');

    await page.getByRole('textbox', { name: 'From' }).click();
    await page.getByRole('textbox', { name: 'From' }).fill('Moa trafikktermin');
    await page
      .getByRole('option', { name: 'Moa trafikkterminal Ålesund', exact: true })
      .click();

    await page.getByRole('textbox', { name: 'To' }).click();
    await page.getByRole('textbox', { name: 'To' }).fill('Ulsteinvik');

    const additionalRequest = page.waitForResponse((request) => {
      return request.url().includes('trip');
    });

    await page
      .getByRole('option', { name: 'Ulsteinvik Ulstein', exact: true })
      .click();

    await additionalRequest;

    await page.getByTestId('tripPattern').first().waitFor();

    await page.getByRole('button', { name: 'Filter' }).click();

    // All modes except "Other" are selected by default, so select all and
    // then none to clear the filter before choosing passenger boat and bus.
    // The checkboxes are visually hidden, so click their labels.
    const allModes = page.getByRole('checkbox', {
      name: 'All transport modes',
    });
    const allModesLabel = page.locator('label[for="all"]');
    await allModesLabel.click();
    await expect(allModes).toBeChecked();
    await allModesLabel.click();
    await expect(allModes).not.toBeChecked();

    await page.locator('label').filter({ hasText: 'Passenger boat' }).click();
    await page.getByText('Bus', { exact: true }).click();
    await expect(
      page.getByRole('checkbox', { name: 'Passenger boat' }),
    ).toBeChecked();
    await expect(
      page.getByRole('checkbox', { name: 'Bus', exact: true }),
    ).toBeChecked();

    await page.getByText('1145').first().click();
    await expect(page.getByText('Correspondence')).toBeVisible();
  });
});
