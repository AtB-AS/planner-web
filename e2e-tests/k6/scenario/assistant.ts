import { Page } from 'k6/browser';
import { Assistant } from '../pages/assistant.ts';
import { Measures } from '../measurements/measures.ts';
import { Metrics } from '../measurements/metrics.ts';
import Conf from '../conf/conf.ts';
import { attachRequestLogger, errorLog, screenshot } from '../utils/utils.ts';
import {
  getFromLocationName,
  getToLocationName,
  getToLocationRegionName,
} from '../data/locations.ts';

export async function assistant(
  page: Page,
  metrics: Metrics,
  region: boolean = false,
) {
  try {
    attachRequestLogger(page);

    await page.goto(`${Conf.host}/assistant`);
    const measures = new Measures(page);
    const assistant = new Assistant(page);
    const fromLocation = getFromLocationName();
    const toLocation = region ? getToLocationRegionName() : getToLocationName();

    // Search
    await assistant.searchFrom(fromLocation);
    await assistant.searchTo(toLocation);
    await assistant.swapLocationsIfDisabled();
    await measures.mark('search');
    const trip = assistant.getFirstTrip();
    await trip.waitFor({
      state: 'visible',
    });
    await measures.mark('search-firstResult');

    // All results are loaded when "load more" button is visible
    const loadMore = assistant.getLoadMoreButton();
    await loadMore.waitFor({
      state: 'visible',
    });
    await measures.mark('search-lastResult');
    const searchToFirstResult = await measures.measure(
      'measure-search-firstResult',
    );
    const searchToLastResult = await measures.measure(
      'measure-search-lastResult',
    );

    // Open trip summary
    await trip.click();
    await measures.mark('assistant-summary-open');
    const tripSummary = assistant.getTripDetails();
    await tripSummary.waitFor({
      state: 'visible',
    });
    await measures.mark('assistant-summary-opened');
    const openSummaryDetails = await measures.measure(
      'measure-assistant-summary-open',
    );

    // Open trip details
    const moreDetails = assistant.getMoreDetails();
    await moreDetails.click();
    await measures.mark('assistant-details-open');
    const tripDetails = assistant.getTripDetails();
    await tripDetails.waitFor({
      state: 'visible',
    });
    await measures.mark('assistant-details-opened');
    const openTripDetails = await measures.measure(
      'measure-assistant-details-open',
    );

    metrics.metricAssistantFirstResult(searchToFirstResult, region);
    metrics.metricAssistantLastResult(searchToLastResult, region);
    metrics.metricAssistantSummaryOpen(openSummaryDetails, region);
    metrics.metricAssistantDetailsOpen(openTripDetails, region);

    await screenshot(page, 'assistant');
  } catch (e) {
    errorLog(`[ERROR] Assistant: ${e}`);
    await screenshot(page, 'error_assistant');
  }
}
