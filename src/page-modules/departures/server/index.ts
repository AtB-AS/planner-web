import {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createGeocoderApi } from './geocoder';

export const departureClient = createExternalClient(
  'http-entur',
  createGeocoderApi,
);

export const withDepartureClient =
  createWithExternalClientDecorator(departureClient);

export const handlerWithDepartureClient =
  createWithExternalClientDecoratorForHttpHandlers(departureClient);
