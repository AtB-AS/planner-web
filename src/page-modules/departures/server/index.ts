import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createGeocoderApi } from './geocoder';
import { createJourneyApi } from './journey-planner';

export const departureClient = createExternalClient(
  'http-entur',
  createGeocoderApi,
);

export const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

const composed = composeClientFactories(departureClient, journeyClient);
export const withDepartureClient = createWithExternalClientDecorator(composed);
export type DepartureClient = ReturnType<typeof composed>;

export const handlerWithDepartureClient =
  createWithExternalClientDecoratorForHttpHandlers(
    composeClientFactories(departureClient, journeyClient),
  );
