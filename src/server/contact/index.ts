import {
  createExternalClient,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createContactApi } from './contact';

const contactFormClient = createExternalClient(
  'http-contact-api',
  createContactApi,
);

export const handlerWithContactFormClient =
  createWithExternalClientDecoratorForHttpHandlers(contactFormClient);
