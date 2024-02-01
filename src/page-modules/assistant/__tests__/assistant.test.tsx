import { cleanup, render, screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExternalClient } from '@atb/modules/api-server';
import { JourneyPlannerApi } from '../server/journey-planner';
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
  tripResult,
} from './assistant-data.fixture';
import {
  addAssistantTripToCache,
  getAssistantTripIfCached,
} from '../server/trip-cache';
import { FromToTripQuery } from '../types';

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
        searchTime: {
          mode: 'departBy',
          dateTime: 123,
        },
        transportModeFilter: null,
        cursor: null,
      },
    });
  });

  it('should render assistant page header', () => {
    render(
      <AssistantLayout
        tripQuery={{
          from: null,
          to: null,
          searchTime: { mode: 'now' },
          cursor: null,
          transportModeFilter: null,
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
          searchTime: { mode: 'departBy', dateTime: Date.now() },
          transportModeFilter: null,
          cursor: null,
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
          searchTime: { mode: 'departBy', dateTime: Date.now() },
          transportModeFilter: ['bus'],
          cursor: null,
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

vi.mock('./', () => ({
  getServerSideProps: vi.fn(),
}));

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
