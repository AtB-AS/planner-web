import { test, expect, type Page } from '@playwright/test';

const fromTextbox = 'Kristiansund';
const fromOption = 'Kristiansund trafikkterminal';
const toTextbox = 'Molde';
const toOption = 'Molde trafikkterminal';

// Holds client-side navigations (getServerSideProps data) until released, to
// simulate a slow connection. Autocomplete is not affected.
async function holdNavigations(page: Page) {
  let release!: () => void;
  const released = new Promise<void>((resolve) => (release = resolve));
  await page.route('**/_next/data/**', async (route) => {
    await released;
    // The request may have been aborted by a newer navigation.
    await route.continue().catch(() => {});
  });
  return release;
}

async function selectLocation(
  page: Page,
  field: 'From' | 'To',
  text: string,
  option: string,
) {
  await page.getByRole('textbox', { name: field }).click();
  await page.getByRole('textbox', { name: field }).fill(text);
  await page.getByRole('option', { name: option }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.E2E_URL ?? 'http://localhost:3000');
});

test('Selecting "to" while "from" navigation is pending keeps both locations', async ({
  page,
}) => {
  const releaseNavigations = await holdNavigations(page);

  await selectLocation(page, 'From', fromTextbox, fromOption);
  await selectLocation(page, 'To', toTextbox, toOption);
  releaseNavigations();

  await expect(page).toHaveURL(/fromId=.*toId=/);
  await expect(page.getByRole('textbox', { name: 'From' })).toHaveValue(
    fromOption,
  );
  await expect(page.getByRole('textbox', { name: 'To' })).toHaveValue(toOption);
  await expect(page.getByTestId('findTravelsButton')).toBeEnabled();
});

test('Swapping while navigations are pending swaps the latest locations', async ({
  page,
}) => {
  const releaseNavigations = await holdNavigations(page);

  await selectLocation(page, 'From', fromTextbox, fromOption);
  await selectLocation(page, 'To', toTextbox, toOption);
  await page
    .getByRole('button', { name: 'Swap place of departure/arrival' })
    .click();
  releaseNavigations();

  await expect(page).toHaveURL(/fromName=Molde.*toName=Kristiansund/);
  await expect(page.getByRole('textbox', { name: 'From' })).toHaveValue(
    toOption,
  );
  await expect(page.getByRole('textbox', { name: 'To' })).toHaveValue(
    fromOption,
  );
  await expect(page.getByTestId('findTravelsButton')).toBeEnabled();
});
