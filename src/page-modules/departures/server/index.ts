import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createJourneyApi } from './journey-planner';
import { createBffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';
import { createBffVehiclesApi } from './vehicles';

const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

const bffGeocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
);

const bffVehiclesClient = createExternalClient(
  'http-bff',
  createBffVehiclesApi,
);

const composed = composeClientFactories(
  journeyClient,
  bffGeocoderClient,
  bffVehiclesClient,
);
export const withDepartureClient = createWithExternalClientDecorator(composed);
export type DepartureClient = ReturnType<typeof composed>;

export const handlerWithDepartureClient =
  createWithExternalClientDecoratorForHttpHandlers(composed);
