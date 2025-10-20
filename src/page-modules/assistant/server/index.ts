import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createJourneyApi } from './journey-planner';
import { createBffGeocoderApi } from '@atb/page-modules/bff/server/geocoder';

<<<<<<< Updated upstream
const geocoderClient = createExternalClient('http-bff', createBffGeocoderApi);
=======
export const geocoderClient = createExternalClient(
  'http-bff',
  createBffGeocoderApi,
);
export const salesClient = createExternalClient(
  'http-sales',
  createSalesSearchApi,
);
>>>>>>> Stashed changes

export const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

<<<<<<< Updated upstream
const composed = composeClientFactories(journeyClient, geocoderClient);
=======
/*const composed = composeClientFactories(
  journeyClient,
  geocoderClient,
  salesClient,
);
>>>>>>> Stashed changes
export const withAssistantClient = createWithExternalClientDecorator(composed);

export type AssistantClient = ReturnType<typeof composed>;

export const handlerWithAssistantClient =
  createWithExternalClientDecoratorForHttpHandlers(
    composeClientFactories(geocoderClient, journeyClient),
  );
 */
