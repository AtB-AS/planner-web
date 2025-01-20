import { Page } from 'k6/browser';
import { Assistant } from '../pages/assistant.ts';
import { Measures } from '../measurements/measures.ts';
import { Metrics } from '../measurements/metrics.ts';
import Conf from '../conf/conf.ts';
import { errorLog, screenshot } from '../utils/utils.ts';
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
    await page.goto(`${Conf.host}/assistant`);
    const measures = new Measures(page);
    const assistant = new Assistant(page);
    const fromLocation = getFromLocationName();
    const toLocation = region ? getToLocationRegionName() : getToLocationName();

    await assistant.searchFrom(fromLocation);
    await assistant.searchTo(toLocation);
    await measures.mark('search');
    await page.waitForNavigation();

    const trip = assistant.getFirstTrip();
    await trip.waitFor({
      state: 'visible',
    });
    await measures.mark('search-firstResult');

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

    // Open trip details
    await trip.click();
    await measures.mark('assistant-details-open');
    await page.waitForNavigation();
    await measures.mark('assistant-details-opened');
    const openTripDetails = await measures.measure(
      'measure-assistant-details-open',
    );

    metrics.metricAssistantFirstResult(searchToFirstResult, region);
    metrics.metricAssistantLastResult(searchToLastResult, region);
    metrics.metricAssistantDetailsOpen(openTripDetails, region);

    await screenshot(page, 'assistant');
  } catch (e) {
    errorLog(`[ERROR] Assistant: ${e}`);
    await screenshot(page, 'error_assistant');
  }
}
