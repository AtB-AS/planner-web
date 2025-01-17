import { browser, Page } from 'k6/browser';
import { Metrics } from '../measurements/metrics.ts';
import { assistant } from './assistant.ts';
import { departures } from './departures.ts';

export async function functScenario(metrics: Metrics) {
  const page: Page = await browser.newPage();
  try {
    await assistant(page, metrics);
    await departures(page, metrics);
  } finally {
    await page.close();
  }
}

/*
  - 75 % search for trips "locally"
  - 25 % search for trips to the region
  - 100% looks up departures
 */
export async function perfScenario(metrics: Metrics) {
  const page: Page = await browser.newPage();
  try {
    if (Math.random() > 0.75) {
      await assistant(page, metrics, true);
    } else {
      await assistant(page, metrics);
    }
    await departures(page, metrics);
  } finally {
    await page.close();
  }
}
