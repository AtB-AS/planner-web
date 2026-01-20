// @ts-ignore
import { expect } from 'https://jslib.k6.io/k6-testing/0.6.1/index.js';
import { Page } from 'k6/browser';
import { Assistant } from '../../pages/assistant.ts';
import Conf from '../../conf/conf.ts';
import {
  errorLog,
  functName,
  screenshot,
  testIdExists,
} from '../../utils/utils.ts';
import {
  getDateForNextMonth,
  formatDateWithOrdinal,
  isTimeEqualOrAfter,
  isTimeEqualOrBefore,
} from '../../utils/time.ts';
import { TimeSelector } from '../../pages/timeSelector.ts';
import { Trip } from '../../pages/trip.ts';
import { Search } from '../../pages/search.ts';

export async function shouldGetResultsGivenTime(page: Page) {
  const functionName = functName(shouldGetResultsGivenTime);
  try {
    const targetTime = '10:30';

    await page.goto(`${Conf.host}/assistant`);
    const assistant = new Assistant(page);
    const timeSelector = new TimeSelector(page);
    const search = new Search(page);

    // Search
    await search.doRandomSearch();
    await assistant.getTrip().waitFor({ state: 'visible' });
    await expect(await assistant.getFirstDayLabel()).toBe('Today');

    // Change search and time: leave at
    await timeSelector.selectSearch('leaveat');
    await timeSelector.openCalendar();
    await timeSelector.changeMonth('next');
    // First Monday of next Month
    const targetDate = getDateForNextMonth(1);
    const newDateLabel = formatDateWithOrdinal(targetDate);
    await timeSelector.setDate(targetDate);
    await timeSelector.setTime(targetTime);
    await assistant.findTravelsButton.waitFor({ state: 'attached' });
    await assistant.findTravelsButton.click();

    // Verify
    await assistant.getTrip().waitFor({ state: 'detached' });
    await assistant.getTrip().waitFor({ state: 'visible' });
    await expect(await assistant.getFirstDayLabel()).not.toBe('Today');
    await expect(await assistant.getFirstDayLabel()).toBe(newDateLabel);
    await expect(
      isTimeEqualOrAfter(await assistant.getTripStartTime(), targetTime),
    ).toBe(true);
    await expect(
      isTimeEqualOrAfter(await assistant.getTripEndTime(), targetTime),
    ).toBe(true);

    // Change search: arrive by
    await timeSelector.selectSearch('arriveby');
    await assistant.findTravelsButton.click();

    // Verify
    await assistant.getTrip().waitFor({ state: 'detached' });
    await assistant.getTrip().waitFor({ state: 'visible' });
    await expect(await assistant.getFirstDayLabel()).toBe(newDateLabel);
    await expect(
      isTimeEqualOrBefore(await assistant.getTripStartTime(), targetTime),
    ).toBe(true);
    await expect(
      isTimeEqualOrBefore(await assistant.getTripEndTime(), targetTime),
    ).toBe(true);
  } catch (e) {
    errorLog(`[ERROR] Assistant ${functionName}: ${e}`);
    await screenshot(page, `error_assistant_${functionName}`);
  }
}

export async function shouldHaveCorrectDetails(page: Page) {
  const functionName = functName(shouldHaveCorrectDetails);
  try {
    const targetTime = '10:30';

    await page.goto(`${Conf.host}/assistant`);
    const assistant = new Assistant(page);
    const timeSelector = new TimeSelector(page);
    const search = new Search(page);

    // Search
    await search.doRandomSearch();
    const fromLocation = await search.fromLocation();
    const toLocation = await search.toLocation();
    await assistant.getTrip().waitFor({ state: 'visible' });

    // Change search and time: leave at
    await timeSelector.selectSearch('leaveat');
    await timeSelector.openCalendar();
    await timeSelector.changeMonth('next');
    // First Monday of next Month
    const targetDate = getDateForNextMonth(1);
    await timeSelector.setDate(targetDate);
    await timeSelector.setTime(targetTime);
    await assistant.findTravelsButton.waitFor({ state: 'attached' });
    await assistant.findTravelsButton.click();

    // Verify
    await assistant.getTrip().waitFor({ state: 'detached' });
    await assistant.getTrip().waitFor({ state: 'visible' });
    const expStartTime = await assistant.getTripStartTime();
    const expEndTime = await assistant.getTripEndTime();

    await assistant.getTrip().click();
    const tripDetails = assistant.tripDetails;
    await tripDetails.waitFor({ state: 'visible' });
    const trip = new Trip(tripDetails);
    const firstLeg = trip.firstLeg;
    const lastLeg = trip.lastLeg;

    expect(await trip.fromName(firstLeg)).toContain(fromLocation);
    expect(await trip.departureTime(firstLeg)).toBe(expStartTime);
    expect(await trip.toName(lastLeg)).toContain(toLocation);
    expect(await trip.arrivalTime(lastLeg)).toBe(expEndTime);
  } catch (e) {
    errorLog(`[ERROR] Assistant ${functionName}: ${e}`);
    await screenshot(page, `error_assistant_${functionName}`);
  }
}

export async function shouldShowPrice(page: Page) {
  const functionName = functName(shouldShowPrice);
  try {
    const fromLocation = 'Prinsens gate';
    const toLocation = 'Solsiden';

    await page.goto(`${Conf.host}/assistant`);
    const assistant = new Assistant(page);
    const search = new Search(page);

    // Search
    await search.doSearch(fromLocation, toLocation);
    await assistant.getTrip().waitFor({ state: 'visible' });

    // Verify
    expect(await assistant.getTripPrice()).toContain('47 kr');
  } catch (e) {
    errorLog(`[ERROR] Assistant ${functionName}: ${e}`);
    await screenshot(page, `error_assistant_${functionName}`);
  }
}

export async function shouldShowBooking(page: Page) {
  const functionName = functName(shouldShowBooking);
  try {
    const targetTime = '15:30';
    const fromLocation = 'Trondheim S';
    const toLocation = 'Steinkjer stasjon';

    await page.goto(`${Conf.host}/assistant`);
    const assistant = new Assistant(page);
    const timeSelector = new TimeSelector(page);
    const search = new Search(page);

    // Search
    await search.doSearch(fromLocation, toLocation);
    await assistant.getTrip().waitFor({ state: 'visible' });

    // Change search and time: leave at
    await timeSelector.selectSearch('leaveat');
    await timeSelector.openCalendar();
    await timeSelector.changeMonth('next');
    // First Monday of next Month
    const targetDate = getDateForNextMonth(1);
    await timeSelector.setDate(targetDate);
    await timeSelector.setTime(targetTime);
    await assistant.findTravelsButton.waitFor({ state: 'attached' });
    await assistant.findTravelsButton.click();
    await assistant.getTrip().waitFor({ state: 'detached' });
    await assistant.getTrip().waitFor({ state: 'visible' });

    // Verify
    expect(await testIdExists(page, 'requireTicketBooking')).toBe(true);
  } catch (e) {
    errorLog(`[ERROR] Assistant ${functionName}: ${e}`);
    await screenshot(page, `error_assistant_${functionName}`);
  }
}

export async function shouldShowPassedDepartureWarning(page: Page) {
  const functionName = functName(shouldShowPassedDepartureWarning);
  try {
    const targetTime = '02:00';
    const fromLocation = 'Prinsens gate';
    const toLocation = 'Solsiden';

    await page.goto(`${Conf.host}/assistant`);
    const assistant = new Assistant(page);
    const timeSelector = new TimeSelector(page);
    const search = new Search(page);

    // Search
    await search.doSearch(fromLocation, toLocation);
    await assistant.getTrip().waitFor({ state: 'visible' });
    // Change search and time: leave at
    await timeSelector.selectSearch('leaveat');
    await timeSelector.setTime(targetTime);
    await assistant.findTravelsButton.waitFor({ state: 'attached' });
    await assistant.findTravelsButton.click();
    await assistant.getTrip().waitFor({ state: 'detached' });
    await assistant.getTrip().waitFor({ state: 'visible' });

    // Verify
    expect(await testIdExists(page, 'tripIsInPast')).toBe(true);
  } catch (e) {
    errorLog(`[ERROR] Assistant ${functionName}: ${e}`);
    await screenshot(page, `error_assistant_${functionName}`);
  }
}
