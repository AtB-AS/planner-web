import {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createBffGeocoderApi } from './geocoder';

const bffGeocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
);

export const withBffClient =
  createWithExternalClientDecorator(bffGeocoderClient);

export type BffClient = ReturnType<typeof bffGeocoderClient>;

export const handlerWithBffClient =
  createWithExternalClientDecoratorForHttpHandlers(bffGeocoderClient);
