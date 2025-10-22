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
import { GlobalMessageContextProvider } from '@atb/modules/global-messages';
import { BffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));
vi.mock('@atb/modules/firebase/transport-mode-filter', () => ({
  getTransportModeFilter: vi.fn(),
}));
vi.mock('@atb/modules/firebase/preassigned-fare-products', () => ({
  getPreassignedFareProducts: vi.fn().mockResolvedValue([]),
}));

mockRouter.useParser(createDynamicRouteParser(['/assistant']));

const customRender = (ui: React.ReactNode) => {
  return render(
    <GlobalMessageContextProvider>{ui}</GlobalMessageContextProvider>,
  );
};

describe('assistant page', function () {
  it('should return props from getServerSideProps', async () => {
    await mockRouter.push('/assistant');

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-bff',
      BffGeocoderApi & JourneyPlannerApi
    > = {
      async trip() {
        return tripResult;
      },
      async nonTransitTrips() {
        return nonTransitTripResult;
      },
      async autocomplete(query) {
        if (query === 'Strindheim') return [fromFeature];
        else return [toFeature];
      },
      async reverse() {
        return {} as any;
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
        fromName: 'Strindheim',
        fromLon: 10.4560389,
        fromLat: 63.4266611,
        fromLayer: 'address',
        toId: 'NSR:StopPlace:43984',
        toName: 'Byåsen skole',
        toLon: 10.358037,
        toLat: 63.398886,
        toLayer: 'venue',
        searchMode: 'departBy',
        searchTime: 123,
        filter: 'bus,metro',
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
        transportModeFilter: ['bus', 'metro'],
        cursor: null,
        lineFilter: null,
      },
    });
  });

  it('should render assistant page header', () => {
    customRender(
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
      name: 'Finn reise',
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
      transportModeFilter: ['bus', 'metro'],
      cursor: null,
      lineFilter: null,
      via: null,
    };

    addAssistantTripToCache(cachedFromToTripQuery, tripResult);

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-bff',
      BffGeocoderApi & JourneyPlannerApi
    > = {
      async trip() {
        return tripResult;
      },
      async nonTransitTrips() {
        return nonTransitTripResult;
      },
      async autocomplete(query) {
        if (query === 'Strindheim') return [fromFeature];
        else return [toFeature];
      },
      async reverse() {
        return {} as any;
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
        fromName: 'Strindheim',
        fromLon: 10.4560389,
        fromLat: 63.4266611,
        fromLayer: 'address',
        toId: 'NSR:StopPlace:43984',
        toName: 'Byåsen skole',
        toLon: 10.358037,
        toLat: 63.398886,
        toLayer: 'venue',
        searchMode: 'departBy',
        searchTime: 123,
        filter: 'bus,metro',
      },
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toMatchObject<AssistantContentProps>({
      tripQuery: cachedFromToTripQuery,
      fallback: tripResult.trip,
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
