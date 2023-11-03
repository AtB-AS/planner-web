import { cleanup, render, screen, within } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ExternalClient } from '@atb/modules/api-server';
import {
  DepartureData,
  JourneyPlannerApi,
} from '@atb/page-modules/departures/server/journey-planner';
import { getServerSideProps } from '@atb/pages/departures/[[...id]]';
import { expectProps } from '@atb/tests/utils';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { departureDataFixture } from './departure-data.fixture';
import { StopPlace } from '../stop-place';
import userEvent from '@testing-library/user-event';
afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/departures/[id]']));

describe('departure page', function () {
  it('Should return props from getServerSideProps', async () => {
    await mockRouter.push('/departures/NSR:StopPlace:123');

    const expectedDeparturesResult: DepartureData = {
      stopPlace: {
        id: 'NSR:StopPlace:123',
        name: 'Test Stop Place',
        description: null,
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
          description: null,
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
      estimatedCalls() {
        return {} as any;
      },
      client: null as any,
    };

    const context = {
      params: {
        id: ['NSR:StopPlace:123'],
      },
      query: {},
    };

    const result = await getServerSideProps({
      client: gqlClient,
      ...context,
    } as any);

    (await expectProps(result)).toContain({
      departures: expectedDeparturesResult,
    });
  });

  it('should render quays', () => {
    const output = render(<StopPlace departures={departureDataFixture} />);

    departureDataFixture.quays.forEach((q) =>
      expect(output.getByText(q.name)).toBeInTheDocument(),
    );
  });

  it('should render estimated calls', () => {
    const output = render(<StopPlace departures={departureDataFixture} />);
    const lists = output.getAllByRole('list');
    const { getAllByRole } = within(lists[0]);
    const items = getAllByRole('listitem');
    expect(items.length).toBe(
      departureDataFixture.quays[0].departures.length + 1,
    );
  });

  it('Should collapse estimated calls list', async () => {
    const output = render(<StopPlace departures={departureDataFixture} />);
    const button = screen.getAllByRole('button', {
      name: 'Aktiver for å minimere',
    });
    let lists = output.getAllByRole('list');
    expect(lists.length).toBe(2);
    await userEvent.click(button[0]);
    lists = output.getAllByRole('list');
    expect(lists.length).toBe(1);
  });
});
