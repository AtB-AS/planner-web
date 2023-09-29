import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HttpClient } from '@atb/modules/api-server';
import { GeocoderApi } from '../server/geocoder';
import { expectProps, getServerSidePropsWithClient } from '@atb/tests/utils';

import DeparturesPage, {
  DeparturesPageProps,
  getServerSideProps,
} from '@atb/pages/departures';

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
        },
        {
          id: '2',
          name: 'Result 2',
          category: [],
          layer: '',
          locality: '',
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
      { id: 'Test ID', name: 'Test', category: [], layer: '', locality: '' },
    ];
    const expectedReverseResult = {
      id: 'Test ID',
      name: 'Test',
      category: [],
      layer: '',
      locality: '',
    };

    const client: HttpClient<'entur', GeocoderApi> = {
      async autocomplete() {
        return expectedAutocompleteResult;
      },
      async reverse() {
        return expectedReverseResult;
      },
      async request() {
        return new Response();
      },
    };
    const result = await getServerSidePropsWithClient(
      client,
      getServerSideProps,
    );

    (await expectProps(result)).toContain({
      autocompleteFeatures: expectedAutocompleteResult,
    });
  });
});
