import { browser } from 'k6/browser';

//TODO extend options
export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async function () {
  const page = await browser.newPage();
  //const browserContext = browser.context();
  //TODO put into a page object
  try {
    await page.goto('http://localhost:3000/assistant');

    await page.locator('[data-testid="searchFrom"]').click()
    await page.locator('[data-testid="searchFrom"]').type('Melhus skysstasjon')

    const option1 =  page.locator('[id="downshift-0-item-0"]')
    await Promise.all([page.waitForNavigation(), option1.click()]);

    await page.locator('[data-testid="searchTo"]').click()
    await page.locator('[data-testid="searchTo"]').type('Prinsens gate')

    const option2 =  page.locator('[id="downshift-1-item-0"]')
    await Promise.all([page.waitForNavigation(), option2.click()]);
    // PERF MARK: search

    const trip1 = page.locator('[data-testid="tripPattern-0-0"]');
    await trip1.waitFor({
      state: 'visible'
    });
    // PERF MARK: first result
    const loadMore = page.locator('[data-testid="loadMoreButton"]');
    await loadMore.waitFor({
      state: 'visible'
    });
    // PERF MARK: last result

    await page.screenshot({ path: 'screenshots/screenshot.png' });
  } finally {
    await page.close();
  }
}