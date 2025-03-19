import { Page } from 'k6/browser';
import { Measures } from '../measurements/measures.ts';
import { Metrics } from '../measurements/metrics.ts';
import { Departures } from '../pages/departures.ts';
import Conf from '../conf/conf.ts';
import { errorLog, screenshot } from '../utils/utils.ts';
import { getFromLocation } from '../data/locations.ts';
import { FromLocationType } from '../types';

export async function departures(page: Page, metrics: Metrics) {
  try {
    await page.goto(`${Conf.host}/departures`);
    const measures = new Measures(page);
    const departures = new Departures(page);

    const fromLocation: FromLocationType = getFromLocation();
    const firstDeparture = departures.getFirstDeparture(fromLocation.quay);
    const estimatedCallsList = departures.getEstimatedCallRows();

    // Search
    await departures.searchFrom(fromLocation.name);
    await measures.mark('search');
    await firstDeparture.waitFor({
      state: 'visible',
    });
    await measures.mark('search-firstResult');
    const searchToFirstResult = await measures.measure(
      'measure-search-firstResult',
    );

    // Open departure details
    await firstDeparture.click();
    await measures.mark('departures-details-open');
    await estimatedCallsList.waitFor({
      state: 'visible',
    });
    await measures.mark('departures-details-opened');
    const openDepDetails = await measures.measure(
      'measure-departures-details-open',
    );

    metrics.metricDeparturesShow(searchToFirstResult);
    metrics.metricDeparturesDetailsOpen(openDepDetails);

    await screenshot(page, 'departures');
  } catch (e) {
    errorLog(`[ERROR] Departures: ${e}`);
    await screenshot(page, 'error_departures');
  }
}
