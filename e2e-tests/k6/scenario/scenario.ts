import { browser, Page } from 'k6/browser';
import { Metrics } from '../measurements/metrics.ts';
import { assistant } from './performance/assistant.ts';
import { departures } from './performance/departures.ts';
import {
  shouldGetResultsGivenTime,
  shouldHaveCorrectDetails,
  shouldShowPassedDepartureWarning,
  shouldShowBooking,
  shouldShowPrice,
} from './functional/assistant.ts';
import {
  shouldGetDeparturesGivenTime,
  shouldShowCorrectStopPlace,
  shouldShowNearbyStopPlaces,
} from './functional/departures.ts';

export async function scenarios(usecase: string, metrics: Metrics) {
  switch (usecase) {
    case 'functional':
      return functional();
    case 'smoke':
      return measure(metrics);
    case 'measure':
      return measure(metrics);
    case 'performance':
      return performance(metrics);
    case 'test':
      return test(metrics);
    default:
      console.log(`[WARN] No usecases with name "${usecase}" exists`);
  }
}

/*
  Used during local testing
 */
async function test(metrics: Metrics) {
  const page: Page = await browser.newPage();
  try {
    await shouldShowPrice(page);
  } finally {
    await page.close();
  }
}

/*
  Collection for tests of different features
 */
async function functional() {
  const page: Page = await browser.newPage();
  try {
    // Assistant
    await shouldGetResultsGivenTime(page);
    await shouldHaveCorrectDetails(page);
    await shouldShowPrice(page);
    await shouldShowBooking(page);
    await shouldShowPassedDepartureWarning(page);

    // Departures
    await shouldGetDeparturesGivenTime(page);
    await shouldShowCorrectStopPlace(page);
    await shouldShowNearbyStopPlaces(page);
  } finally {
    await page.close();
  }
}

/*
  Simple walkthrough with measurements of used time for different operations
 */
async function measure(metrics: Metrics) {
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
async function performance(metrics: Metrics) {
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
