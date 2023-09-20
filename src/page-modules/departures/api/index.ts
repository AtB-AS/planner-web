import {
  createHttpClient,
  createWithHttpClientDecorator,
} from '@atb/modules/api-client';
import { createAutocompleteApi } from './autocomplete';

export type { AutocompleteFeature } from './autocomplete';

export const departureClient = createHttpClient('entur', createAutocompleteApi);

export const withDepartureClient =
  createWithHttpClientDecorator(departureClient);
