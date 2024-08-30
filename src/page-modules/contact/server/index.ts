import {
  composeClientFactories,
  createExternalClient,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createContactApi } from './contact';
import { createJourneyApi } from './journey-planner';

export const contactFormClient = createExternalClient(
  'http-contact-api',
  createContactApi,
);

export const journeyClient = createExternalClient(
  'graphql-journeyPlanner3',
  createJourneyApi,
);

export const handlerWithContactFormClient =
  createWithExternalClientDecoratorForHttpHandlers(
    composeClientFactories(contactFormClient, journeyClient),
  );
