import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createJourneyApi } from './journey-planner';
import { createBffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';

export const geocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
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
