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
    const departure = departures.getFirstDeparture(fromLocation.quay);

    await departures.searchFrom(fromLocation.name);
    await measures.mark('search');
    await page.waitForNavigation();
    await departure.waitFor({
      state: 'visible',
    });
    await measures.mark('search-firstResult');
    const searchToFirstResult = await measures.measure(
      'measure-search-firstResult',
    );

    // Open departure details
    await departure.click();
    await measures.mark('departures-details-open');
    await page.waitForNavigation();
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
