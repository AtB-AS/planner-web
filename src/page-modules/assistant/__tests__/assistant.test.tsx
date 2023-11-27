import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExternalClient } from '@atb/modules/api-server';
import { JourneyPlannerApi } from '../server/journey-planner';
import { getServerSideProps } from '@atb/pages/assistant';
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

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

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

    (await expectProps(result)).toMatchObject({
      initialFromFeature: fromFeature,
      initialToFeature: toFeature,
      initialSearchTime: {
        mode: 'departBy',
        dateTime: 123,
      },
      trip: tripResult,
      nonTransitTrips: nonTransitTripResult,
    });
  });

  it('should render assistant page header', () => {
    render(<AssistantLayout />);

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

  it('should render empty search results', () => {
    const output = render(
      <Trip
        initialFromFeature={fromFeature}
        initialToFeature={toFeature}
        trip={{ ...tripResult, tripPatterns: [] }}
        initialSearchTime={{ mode: 'departBy', dateTime: Date.now() }}
        nonTransitTrips={nonTransitTripResult}
        initialTransportModesFilter={null}
      />,
    );

    expect(
      output.getByText('Ingen kollektivreiser passer til ditt søk'),
    ).toBeInTheDocument();

    expect(
      output.getByText('Prøv å justere på sted eller tidspunkt.'),
    ).toBeInTheDocument();
  });

  it('should render empty search results with filter details', () => {
    const output = render(
      <Trip
        initialFromFeature={fromFeature}
        initialToFeature={toFeature}
        trip={{ ...tripResult, tripPatterns: [] }}
        initialSearchTime={{ mode: 'departBy', dateTime: Date.now() }}
        nonTransitTrips={nonTransitTripResult}
        initialTransportModesFilter={['bus']}
      />,
    );

    expect(
      output.getByText('Prøv å justere på sted, filter eller tidspunkt.'),
    ).toBeInTheDocument();
  });
});
