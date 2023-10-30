import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExternalClient } from '@atb/modules/api-server';
import { JourneyPlannerApi } from '@atb/page-modules/assistant/server/journey-planner';
import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { getServerSideProps } from '@atb/pages/assistant';
import { expectProps } from '@atb/tests/utils';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { FeatureCategory } from '@atb/components/venue-icon';
import { GeocoderApi } from '@atb/page-modules/departures/server/geocoder';
import AssistantLayout from '../layout';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/assistant']));

describe('assistant page', function () {
  it('should return props from getServerSideProps', async () => {
    await mockRouter.push('/assistant');

    const expectedFromFeature: GeocoderFeature = {
      id: '638651',
      name: 'Strindheim',
      locality: 'Trondheim',
      category: [FeatureCategory.BYDEL],
      layer: 'address',
      geometry: {
        coordinates: [10.456038846578249, 63.42666114395819],
      },
    };

    const expectedToFeature: GeocoderFeature = {
      id: 'NSR:StopPlace:43984',
      name: 'Byåsen skole',
      locality: 'Trondheim',
      category: [FeatureCategory.ONSTREET_BUS],
      layer: 'venue',
      geometry: { coordinates: [10.358037, 63.398886] },
    };

    const expectedTripResult: TripData = {
      nextPageCursor: 'aaa',
      previousPageCursor: 'bbb',
      tripPatterns: [],
    };

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-entur',
      GeocoderApi & JourneyPlannerApi
    > = {
      async trip() {
        return expectedTripResult;
      },
      async autocomplete() {
        return {} as any;
      },
      async reverse(lat, lon, layers) {
        if (layers === 'address') return expectedFromFeature;
        else return expectedToFeature;
      },
      client: null as any,
    };

    const context = {
      params: {},
      query: {
        fromId: '638651',
        fromLon: '10.4560389',
        fromLat: '63.4266611',
        fromLayer: 'address',
        toId: 'NSR:StopPlace:43984',
        toLon: '10.358037',
        toLat: '63.398886',
        toLayer: 'venue',
      },
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toContain({
      initialFromFeature: expectedFromFeature,
      initialToFeature: expectedToFeature,
      trip: expectedTripResult,
      departureType: 'departure',
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
});
