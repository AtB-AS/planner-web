import {
  createHttpClient,
  createWithHttpClientDecorator,
  createWithHttpClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createAutocompleteApi } from './autocomplete';

export const departureClient = createHttpClient('entur', createAutocompleteApi);

export const withDepartureClient =
  createWithHttpClientDecorator(departureClient);

export const handlerWithDepartureClient =
  createWithHttpClientDecoratorForHttpHandlers(departureClient);
