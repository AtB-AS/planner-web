import { createSubmitRouteHandler } from '@mrfylke/contact-form/server';
import { createRequester } from '@atb/modules/api-server';

export const POST = createSubmitRouteHandler({
  request: createRequester('http-contact-api'),
});
