import { cleanup, render, screen, within } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExternalClient } from '@atb/modules/api-server';
import { JourneyPlannerApi } from '../server/journey-planner';
import { getServerSideProps } from '@atb/pages/departures/[[...id]]';
import { expectProps } from '@atb/tests/utils';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { departureDataFixture } from './departure-data.fixture';
import { StopPlace } from '../stop-place';
import userEvent from '@testing-library/user-event';
import { NearestStopPlaces } from '..';
import Search from '@atb/components/search/search';
import { sortQuays } from '../server/journey-planner/utils';
import { GlobalMessageContextProvider } from '@atb/modules/global-messages';
import { BffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/departures/[id]']));

const customRender = (ui: React.ReactNode) => {
  return render(
    <GlobalMessageContextProvider>{ui}</GlobalMessageContextProvider>,
  );
};

describe('departure page', function () {
  it('Should return props from getServerSideProps', async () => {
    await mockRouter.push('/departures/NSR:StopPlace:123');

    const expectedDeparturesResult = {
      empty: true,
      fromQuery: {
        from: null,
        isAddress: false,
        searchTime: {
          mode: 'now',
        },
      },
      headersAcceptLanguage: '',
      initialCookies: {
        darkmode: null,
        language: null,
      },
      referer: '',
    };

    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3' | 'http-bff',
      BffGeocoderApi & JourneyPlannerApi
    > = {
      async departures() {
        return departureDataFixture;
      },
      nearestStopPlaces() {
        return {} as any;
      },
      stopPlace() {
        return {
          position: {
            lat: 0,
            lon: 0,
          },
        } as any;
      },
      estimatedCalls() {
        return {} as any;
      },
      async autocomplete() {
        return {} as any;
      },
      async reverse(lat, lon, layers) {
        return {} as any;
      },
      serviceJourney() {
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

    (await expectProps(result)).toMatchObject(expectedDeparturesResult);
  });

  it('should render quays', () => {
    const output = customRender(
      <StopPlace departures={departureDataFixture} />,
    );

    departureDataFixture.stopPlace.quays.forEach((q) =>
      expect(output.getByText(q.name)).toBeInTheDocument(),
    );
  });

  it('should render estimated calls', () => {
    const output = customRender(
      <StopPlace departures={departureDataFixture} />,
    );
    const lists = output.getAllByRole('list');
    const { getAllByRole } = within(lists[0]);
    const items = getAllByRole('listitem');
    expect(items.length).toBe(
      departureDataFixture.stopPlace.quays[0].estimatedCalls.length + 1,
    );
  });

  it('Should collapse estimated calls list', async () => {
    const output = customRender(
      <StopPlace departures={departureDataFixture} />,
    );
    const button = screen.getAllByRole('button', {
      name: 'Aktiver for å minimere',
    });
    let lists = output.getAllByRole('list');
    expect(lists.length).toBe(3);
    await userEvent.click(button[0]);
    lists = output.getAllByRole('list');
    expect(lists.length).toBe(2);
  });

  it('should render empty search results', () => {
    const output = render(
      <NearestStopPlaces
        fromQuery={{
          searchTime: { mode: 'now' },
          from: null,
          isAddress: false,
        }}
        nearestStopPlaces={[]}
      />,
    );
    expect(
      output.getByText('Finner ingen holdeplasser i nærheten'),
    ).toBeInTheDocument();
  });

  it('should render Search component with expected placeholder text', () => {
    const testPlaceholder = 'Søk fra adresse, kai eller holdeplass';
    render(
      <Search label="Test" placeholder={testPlaceholder} onChange={() => {}} />,
    );

    const inputElement = screen.getByPlaceholderText(testPlaceholder);
    expect(inputElement).toBeInTheDocument();
  });

  it('should sort quays by public code and departures', () => {
    const quays = [
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: 'B2',
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: 'B1',
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: undefined,
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: '1',
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: '2',
        departures: [],
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: 'A1',
      },
      {
        ...departureDataFixture.stopPlace.quays[0],
        publicCode: '0',
      },
    ];

    quays.sort(sortQuays);

    expect(quays[0].publicCode).toBe('0');
    expect(quays[1].publicCode).toBe('1');
    expect(quays[2].publicCode).toBe('2');
    expect(quays[3].publicCode).toBe('A1');
    expect(quays[4].publicCode).toBe('B1');
    expect(quays[5].publicCode).toBe('B2');
    expect(quays[6].publicCode).toBe(undefined);
  });
});
