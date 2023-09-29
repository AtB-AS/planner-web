import { ExternalClient } from '@atb/modules/api-server';
import { GeocoderApi } from '../server/geocoder';
import { expectProps, getServerSidePropsWithClient } from '@atb/tests/utils';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import DeparturesPage, {
  DeparturesPageProps,
  getServerSideProps,
} from '@atb/pages/departures';
import { JourneyPlannerApi } from '../server/journey-planner';

afterEach(function () {
  cleanup();
});

describe('departure page', function () {
  it('Should show list as provided from initial props ', async () => {
    const initialProps: DeparturesPageProps = {
      autocompleteFeatures: [
        {
          id: '1',
          name: 'Result 1',
          category: [],
          layer: '',
          locality: '',
          geometry: {
            coordinates: [62.47, 6.14],
          },
        },
        {
          id: '2',
          name: 'Result 2',
          category: [],
          layer: '',
          locality: '',
          geometry: {
            coordinates: [62.47, 6.14],
          },
        },
      ],
      headersAcceptLanguage: 'en',
      initialCookies: {
        darkmode: false,
        language: 'en',
      },
    };

    const output = render(<DeparturesPage {...initialProps} />);
    expect(await output.findAllByText(/^Result/)).toHaveLength(2);
  });

  it('Should return props from getServerSideProps', async () => {
    const expectedAutocompleteResult = [
      {
        id: 'Test ID',
        name: 'Test',
        category: [],
        layer: '',
        locality: '',
        geometry: {
          coordinates: [62.47, 6.14],
        },
      },
    ];
    const expectedReverseResult = {
      id: 'Test ID',
      name: 'Test',
      category: [],
      layer: '',
      locality: '',
      geometry: {
        coordinates: [62.47, 6.14],
      },
    };

    const client: ExternalClient<'http-entur', GeocoderApi> = {
      async autocomplete() {
        return expectedAutocompleteResult;
      },
      async reverse() {
        return expectedReverseResult;
      },
      async client() {
        return new Response();
      },
    };
    const gqlClient: ExternalClient<
      'graphql-journeyPlanner3',
      JourneyPlannerApi
    > = {
      async departures() {
        return {};
      },
      client: null as any,
    };

    const result = await getServerSidePropsWithClient(
      { ...client, ...gqlClient },
      getServerSideProps,
    );

    (await expectProps(result)).toContain({
      autocompleteFeatures: expectedAutocompleteResult,
    });
  });
});
