import {
  createHttpClient,
  createWithHttpClientDecorator,
  createWithHttpClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createGeocoderApi } from './geocoder';

export const departureClient = createHttpClient('entur', createGeocoderApi);

export const withDepartureClient =
  createWithHttpClientDecorator(departureClient);

export const handlerWithDepartureClient =
  createWithHttpClientDecoratorForHttpHandlers(departureClient);
