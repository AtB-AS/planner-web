import { IncomingMessage } from 'http';
import {
  HttpRequester,
  ApplicationError,
  AllEndpoints,
  GraphQlRequester,
} from './requesters/types';

export { genericError, tryResult, errorResultAsJson } from './requesters/utils';

import { ExternalClient, ExternalClientFactory } from './external-client';

export type {
  AllEndpoints,
  HttpRequester,
  ExternalClient,
  ExternalClientFactory,
};

export { GraphQlRequester, ApplicationError };

export {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from './external-client';

export function composeClientFactories<
  U1 extends AllEndpoints,
  T1,
  U2 extends AllEndpoints,
  T2,
>(
  client1: ExternalClientFactory<U1, T1>,
  client2: ExternalClientFactory<U2, T2>,
): ExternalClientFactory<U1 | U2, T2 & T1> {
  return function (req?: IncomingMessage) {
    return {
      ...client1(req),
      ...client2(req),
    };
  };
}
