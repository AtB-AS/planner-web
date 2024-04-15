import { cleanup, render, screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExternalClient } from '@atb/modules/api-server';
import {
  JourneyPlannerApi,
  findTripPatternCombinationsList,
  findTripPatternsFromViaTo,
} from '../server/journey-planner';
import {
  AssistantContentProps,
  getServerSideProps,
} from '@atb/pages/assistant';
import { expectProps } from '@atb/tests/utils';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { GeocoderApi } from '@atb/page-modules/departures/server/geocoder';
import AssistantLayout from '../layout';
import Trip from '../trip';
import {
  fromFeature,
  nonTransitTripResult,
  toFeature,
  tripPatternCombinationList,
  tripPatternCombinations,
  tripPatternsFromVia,
  tripPatternsFromViaTo,
  tripPatternsViaTo,
  tripResult,
  viaFeature,
} from './assistant-data.fixture';
import {
  addAssistantTripToCache,
  getAssistantTripIfCached,
} from '../server/trip-cache';
import { FromToTripQuery } from '../types';
import {
  getHoursDifferenceFromCET,
  getLastSundayOfMonthAndSetTime,
  isDaylightSavingTime,
} from '@atb/utils/date';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));
vi.mock('@atb/modules/firebase/transport-mode-filter', () => ({
  getTransportModeFilter: vi.fn(),
}));

mockRouter.useParser(createDynamicRouteParser(['/assistant']));

describe('assistant page', function () {
  it('should return props from getServerSideProps', async () => {
    await mockRouter.push('/assistant');

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-entur',
      GeocoderApi & JourneyPlannerApi
    > = {
      async trip() {
        return tripResult;
      },
      async nonTransitTrips() {
        return nonTransitTripResult;
      },
      async autocomplete() {
        return {} as any;
      },
      async reverse(lat, lon, layers) {
        if (layers === 'address') return fromFeature;
        else return toFeature;
      },
      async singleTrip() {
        return {} as any;
      },
      async lines() {
        return {} as any;
      },
      client: null as any,
    };

    const context = {
      params: {},
      query: {
        fromId: '638651',
        fromLon: 10.4560389,
        fromLat: 63.4266611,
        fromLayer: 'address',
        toId: 'NSR:StopPlace:43984',
        toLon: 10.358037,
        toLat: 63.398886,
        toLayer: 'venue',
        searchMode: 'departBy',
        searchTime: 123,
      },
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toMatchObject<AssistantContentProps>({
      tripQuery: {
        from: fromFeature,
        to: toFeature,
        via: null,
        searchTime: {
          mode: 'departBy',
          dateTime: 123,
        },
        transportModeFilter: null,
        cursor: null,
        lineFilter: null,
      },
    });
  });

  it('should render assistant page header', () => {
    render(
      <AssistantLayout
        tripQuery={{
          from: null,
          to: null,
          via: null,
          searchTime: { mode: 'now' },
          cursor: null,
          transportModeFilter: null,
          lineFilter: null,
        }}
      />,
    );

    expect(screen.getByText('Fra')).toBeInTheDocument();
    expect(screen.getByText('Til')).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Bytt avreisested og ankomststed',
      }),
    ).toBeInTheDocument();

    const submitButton = screen.getByRole('button', {
      name: 'Finn avganger',
    });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should render empty search results', async () => {
    const output = render(
      <Trip
        tripQuery={{
          from: fromFeature,
          to: toFeature,
          via: null,
          searchTime: { mode: 'departBy', dateTime: Date.now() },
          transportModeFilter: null,
          cursor: null,
          lineFilter: null,
        }}
      />,
    );

    await waitFor(
      () => {
        expect(
          output.getByText('Ingen kollektivreiser passer til ditt søk'),
        ).toBeInTheDocument();

        expect(
          output.getByText('Prøv å justere på sted eller tidspunkt.'),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('should render empty search results with filter details', async () => {
    const output = render(
      <Trip
        tripQuery={{
          from: fromFeature,
          to: toFeature,
          via: null,
          searchTime: { mode: 'departBy', dateTime: Date.now() },
          transportModeFilter: ['bus'],
          cursor: null,
          lineFilter: [],
        }}
      />,
    );

    await waitFor(
      () => {
        expect(
          output.getByText('Prøv å justere på sted, filter eller tidspunkt.'),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });

  it('should render empty search results with filter details', async () => {
    const output = render(
      <Trip
        tripQuery={{
          from: fromFeature,
          to: toFeature,
          via: viaFeature,
          searchTime: { mode: 'departBy', dateTime: Date.now() },
          transportModeFilter: ['bus'],
          cursor: null,
          lineFilter: null,
        }}
      />,
    );

    await waitFor(
      () => {
        expect(
          output.getByText('Prøv å justere på sted, filter eller tidspunkt.'),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});

describe('assistant page', function () {
  it('should add trip to trip cache', () => {
    const fromToTripQuery: FromToTripQuery = {
      from: fromFeature,
      to: toFeature,
      searchTime: {
        mode: 'departBy',
        dateTime: 123,
      },
      transportModeFilter: null,
      cursor: null,
      lineFilter: null,
    };

    addAssistantTripToCache(fromToTripQuery, tripResult);

    const cachedTrip = getAssistantTripIfCached(fromToTripQuery);

    expect(cachedTrip).toEqual(tripResult);
  });

  it('should not find trip in cache with different query', () => {
    const fromToTripQuery1: FromToTripQuery = {
      from: fromFeature,
      to: toFeature,
      searchTime: {
        mode: 'departBy',
        dateTime: 123,
      },
      transportModeFilter: null,
      cursor: null,
      lineFilter: null,
      via: null,
    };
    const fromToTripQuery2: FromToTripQuery = {
      from: fromFeature,
      to: toFeature,
      searchTime: {
        mode: 'arriveBy',
        dateTime: 321,
      },
      transportModeFilter: null,
      cursor: null,
      lineFilter: null,
    };

    addAssistantTripToCache(fromToTripQuery1, tripResult);

    const cachedTrip = getAssistantTripIfCached(fromToTripQuery2);

    expect(cachedTrip).toBeUndefined();
  });

  it('should add trip to fallback prop if it exists in the cache', async () => {
    await mockRouter.push('/assistant');

    const cachedFromToTripQuery: FromToTripQuery = {
      from: fromFeature,
      to: toFeature,
      searchTime: {
        mode: 'departBy',
        dateTime: 123,
      },
      transportModeFilter: null,
      cursor: null,
      lineFilter: null,
      via: null,
    };

    addAssistantTripToCache(cachedFromToTripQuery, tripResult);

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-entur',
      GeocoderApi & JourneyPlannerApi
    > = {
      async trip() {
        return tripResult;
      },
      async nonTransitTrips() {
        return nonTransitTripResult;
      },
      async autocomplete() {
        return {} as any;
      },
      async reverse(lat, lon, layers) {
        if (layers === 'address') return fromFeature;
        else return toFeature;
      },
      async singleTrip() {
        return {} as any;
      },
      async lines() {
        return {} as any;
      },
      client: null as any,
    };

    const context = {
      params: {},
      query: {
        fromId: '638651',
        fromLon: 10.4560389,
        fromLat: 63.4266611,
        fromLayer: 'address',
        toId: 'NSR:StopPlace:43984',
        toLon: 10.358037,
        toLat: 63.398886,
        toLayer: 'venue',
        searchMode: 'departBy',
        searchTime: 123,
      },
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toMatchObject<AssistantContentProps>({
      tripQuery: cachedFromToTripQuery,
      fallback: tripResult,
    });
  });
});

describe('findTripPatternCombinationsList', () => {
  it('should return the correct trip pattern combinations list', () => {
    const result = findTripPatternCombinationsList(tripPatternCombinations);

    expect(result).toEqual(tripPatternCombinationList);
  });
});

describe('findTripPatternsFromViaTo', () => {
  it('should return the correct trip patterns from via to', () => {
    const result = findTripPatternsFromViaTo(
      tripPatternCombinationList,
      tripPatternsFromVia,
      tripPatternsViaTo,
    );

    expect(result).toEqual(tripPatternsFromViaTo);
  });
});

describe('isDaylightSavingTime', () => {
  const winterTime = new Date(2024, 0, 2);
  const summerTime = new Date(2024, 6, 2);

  it(`should rejects that date ${winterTime} is within daylight saving time (DST).`, () => {
    const isWhitinDST = isDaylightSavingTime(winterTime);
    expect(isWhitinDST).toBeFalsy();
  });

  it(`should confime that date ${summerTime} is within daylight saving time (DST).`, () => {
    const isWhitinDST = isDaylightSavingTime(summerTime);
    expect(isWhitinDST).toBeTruthy();
  });
});

describe('getCETOffset', () => {
  const timezones = [
    { name: 'Asia/Tokyo', etcOffsetWinterTime: 8, etcOffsetSummerTime: 7 },
    { name: 'Europe/Helsinki', etcOffsetWinterTime: 1, etcOffsetSummerTime: 1 },
    { name: 'Europe/Oslo', etcOffsetWinterTime: 0, etcOffsetSummerTime: 0 },
    { name: 'Europe/London', etcOffsetWinterTime: -1, etcOffsetSummerTime: -1 },
    {
      name: 'America/Los_Angeles',
      etcOffsetWinterTime: -9,
      etcOffsetSummerTime: -9,
    },
    {
      name: 'Asia/Kolkata',
      etcOffsetWinterTime: 4.5,
      etcOffsetSummerTime: 3.5,
    },
  ];

  timezones.forEach((timezone) => {
    it(`should return the offset from Europe/Oslo to ${timezone.name}.`, () => {
      const winterTime = new Date(2024, 0, 2);
      let hoursDifference = getHoursDifferenceFromCET(
        winterTime.getTime(),
        timezone.name,
      );
      expect(hoursDifference).toEqual(timezone.etcOffsetWinterTime);
    });

    it(`should return the offset from Europe/Oslo to ${timezone.name} when DST in Norway.`, () => {
      const summerTime = new Date(2024, 6, 2);
      let hoursDifference = getHoursDifferenceFromCET(
        summerTime.getTime(),
        timezone.name,
      );
      expect(hoursDifference).toEqual(timezone.etcOffsetSummerTime);
    });
  });
});

describe('getLastSundayOfMonthWithTime', () => {
  it('should return the date of the last sunday in given year, month, and with specified time.', () => {
    const year = 2024;
    const march = 2;
    const day = 31;
    const hour = 2;

    const dateLastSundayInMarch2024 = new Date(year, march, day, hour);
    const result = getLastSundayOfMonthAndSetTime(year, march, hour);

    expect(result).toEqual(dateLastSundayInMarch2024);
  });

  it('should return the date of the last sunday in given year, month, and with specified time.', () => {
    const year = 2024;
    const october = 9;
    const day = 27;
    const hour = 3;

    const dateLastSundayInOctober2024 = new Date(year, october, day, hour);
    const result = getLastSundayOfMonthAndSetTime(year, october, hour);

    expect(result).toEqual(dateLastSundayInOctober2024);
  });
});
