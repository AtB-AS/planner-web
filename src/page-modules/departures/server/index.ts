import {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createAutocompleteApi } from './autocomplete';

export const departureClient = createExternalClient(
  'http-entur',
  createAutocompleteApi,
);

export const withDepartureClient =
  createWithExternalClientDecorator(departureClient);

export const handlerWithDepartureClient =
  createWithExternalClientDecoratorForHttpHandlers(departureClient);
