// @ts-ignore
import { expect } from 'https://jslib.k6.io/k6-testing/0.6.1/index.js';
import { Page } from 'k6/browser';
import { Departures } from '../../pages/departures.ts';
import Conf from '../../conf/conf.ts';
import { errorLog, functName, screenshot } from '../../utils/utils.ts';
import { TimeSelector } from '../../pages/timeSelector.ts';
import { FromAddressType, FromLocationType } from '../../types';
import { getFromAddress, getFromLocation } from '../../data/locations.ts';
import { getDateForNextMonth, isTimeEqualOrAfter } from '../../utils/time.ts';
import { Search } from '../../pages/search.ts';

export async function shouldGetDeparturesGivenTime(page: Page) {
  const functionName = functName(shouldGetDeparturesGivenTime);
  try {
    const targetTime = '10:30';
    const fromLocation: FromLocationType = getFromLocation();

    await page.goto(`${Conf.host}/departures`);
    const departures = new Departures(page);
    const timeSelector = new TimeSelector(page);
    const search = new Search(page);

    // Search
    await search.searchFrom(fromLocation.name);
    await departures
      .getDeparture(fromLocation.quay)
      .waitFor({ state: 'visible' });
    await expect(
      validateDepartureTime(
        await departures.getDepartureTime(fromLocation.quay),
      ),
    ).toBe(true);

    // Change search and time: leave at
    await timeSelector.selectSearch('leaveat');
    await timeSelector.openCalendar();
    await timeSelector.changeMonth('next');
    // First Monday of next Month
    const targetDate = getDateForNextMonth(1);
    await timeSelector.setDate(targetDate);
    await timeSelector.setTime(targetTime);
    await departures.findDeparturesButton.waitFor({ state: 'attached' });
    await departures.findDeparturesButton.click();

    // Verify
    await departures
      .getDeparture(fromLocation.quay)
      .waitFor({ state: 'detached' });
    await departures
      .getDeparture(fromLocation.quay)
      .waitFor({ state: 'visible' });

    await expect(
      isTimeEqualOrAfter(
        await departures.getDepartureTime(fromLocation.quay),
        targetTime,
      ),
    ).toBe(true);
  } catch (e) {
    errorLog(`[ERROR] Departures ${functionName}: ${e}`);
    await screenshot(page, `error_departures_${functionName}`);
  }

  // Valid departure times: Now, x min, HH:MM
  function validateDepartureTime(depTime: string) {
    if (
      !(depTime.includes(':') || depTime.includes('min') || depTime == 'Now')
    ) {
      return false;
    }
    // Correct format
    if (depTime.includes(':')) {
      return /^([01]\d|2[0-3]):([0-5]\d)$/.test(depTime);
    }
    // Below 10 min
    else if (depTime.includes('min')) {
      return Number(depTime.split(' ')[0]) < 10;
    }
    return true;
  }
}

export async function shouldShowCorrectStopPlace(page: Page) {
  const functionName = functName(shouldShowCorrectStopPlace);
  try {
    const fromLocation: FromLocationType = getFromLocation();
    await page.goto(`${Conf.host}/departures`);
    const departures = new Departures(page);
    const search = new Search(page);

    // Search
    await search.searchFrom(fromLocation.name);
    await departures
      .getDeparture(fromLocation.quay)
      .waitFor({ state: 'visible' });

    // Validate - quay names
    const quayNames = await departures.getQuayNames();
    for (const quay of quayNames) {
      expect(quay).toContain(fromLocation.name);
    }
    // Validate - stop place name
    expect(await departures.getStopPlaceName()).toContain(fromLocation.name);
  } catch (e) {
    errorLog(`[ERROR] Departures ${functionName}: ${e}`);
    await screenshot(page, `error_departures_${functionName}`);
  }
}

export async function shouldShowNearbyStopPlaces(page: Page) {
  const functionName = functName(shouldShowNearbyStopPlaces);
  try {
    const fromAddress: FromAddressType = getFromAddress();
    await page.goto(`${Conf.host}/departures`);
    const departures = new Departures(page);
    const search = new Search(page);

    // Search
    await search.searchFrom(fromAddress.name, 'address');
    await departures.getNearbyStopPlaces.first().waitFor({ state: 'visible' });

    // Validate - address for map
    expect(await departures.getAddressName()).toContain(fromAddress.name);

    // Validate - nearby stop places
    expect(await departures.getNearbyStopPlaceName()).toContain(
      fromAddress.nearbyStopPlace,
    );

    // Validate - visit nearby stop place
    await departures.getNearbyStopPlaces.first().click();
    await departures.departuresList.first().waitFor({ state: 'visible' });
    expect(await departures.getStopPlaceName()).toContain(
      fromAddress.nearbyStopPlace,
    );
  } catch (e) {
    errorLog(`[ERROR] Departures ${functionName}: ${e}`);
    await screenshot(page, `error_departures_${functionName}`);
  }
}
