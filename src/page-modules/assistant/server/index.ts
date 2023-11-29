import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createJourneyApi } from './journey-planner';
import { createGeocoderApi } from '@atb/page-modules/departures/server/geocoder';

export const geocoderClient = createExternalClient(
  'http-entur',
  createGeocoderApi,
);

export const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

const composed = composeClientFactories(journeyClient, geocoderClient);
export const withAssistantClient = createWithExternalClientDecorator(composed);

export type AssistantClient = ReturnType<typeof composed>;

export const handlerWithAssistantClient =
  createWithExternalClientDecoratorForHttpHandlers(
    composeClientFactories(geocoderClient, journeyClient),
  );
