import {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
  composeClientFactories,
} from '@atb/modules/api-server';
import { createBffGeocoderApi } from './geocoder';

const bffGeocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
);

const composed = composeClientFactories(bffGeocoderClient);

export const withBffClient = createWithExternalClientDecorator(composed);

export type BffClient = ReturnType<typeof composed>;

export const handlerWithBffClient =
  createWithExternalClientDecoratorForHttpHandlers(composed);
