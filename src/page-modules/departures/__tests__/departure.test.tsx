import { cleanup, render } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExternalClient } from '@atb/modules/api-server';
import {
  DepartureData,
  JourneyPlannerApi,
} from '@atb/page-modules/departures/server/journey-planner';
import DeparturesPage, {
  DeparturesPageProps,
  getServerSideProps,
} from '@atb/pages/departures/[[...id]]';
import { expectProps } from '@atb/tests/utils';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { GeocoderApi } from '../server/geocoder';
import { GeocoderFeature } from '../types';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/departures/[id]']));

describe('departure page', function () {
  it('should show id provided in route', async () => {
    await mockRouter.push('/departures/NSR:StopPlace:123');

    const initialProps: DeparturesPageProps = {
      headersAcceptLanguage: 'en',
      initialCookies: {
        darkmode: false,
        language: 'en',
      },
    };

    const output = render(<DeparturesPage {...initialProps} />);
    expect(output.getByText('Query: NSR:StopPlace:123')).toBeInTheDocument();
  });

  it('Should return props from getServerSideProps', async () => {
    await mockRouter.push('/departures/NSR:StopPlace:123');

    const expectedDeparturesResult: DepartureData = {
      stopPlace: {
        id: 'NSR:StopPlace:123',
        name: 'Test Stop Place',
        position: {
          lat: 0,
          lon: 0,
        },
      },
      quays: [
        {
          id: 'NSR:Quay:123',
          name: 'Test Quay',
          publicCode: '123',
          departures: [],
        },
      ],
    };

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3',
      JourneyPlannerApi
    > = {
      async departures() {
        return expectedDeparturesResult;
      },
      nearestStopPlaces() {
        return {} as any;
      },
      stopPlace() {
        return {} as any;
      },
      client: null as any,
    };

    const context = {
      params: {
        id: ['NSR:StopPlace:123'],
      },
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toContain({
      departures: expectedDeparturesResult,
    });
  });
});
