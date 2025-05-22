import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createJourneyApi } from './journey-planner';
import { createBffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';

const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

const bffGeocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
);

const composed = composeClientFactories(journeyClient, bffGeocoderClient);
export const withDepartureClient = createWithExternalClientDecorator(composed);
export type DepartureClient = ReturnType<typeof composed>;

export const handlerWithDepartureClient =
  createWithExternalClientDecoratorForHttpHandlers(composed);
