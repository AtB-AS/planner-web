import { IncomingMessage } from 'http';
import {
  HttpClient,
  HttpClientFactory,
  HttpEndpoints,
  Requester,
} from './types';

export {
  ApplicationError,
  errorResultAsJson,
  genericError,
  logApplicationError,
  tryResult,
} from './utils';

export type { Requester, HttpClientFactory, HttpClient, HttpEndpoints };

export {
  createHttpClient,
  createWithHttpClientDecorator,
  createWithHttpClientDecoratorForHttpHandlers,
} from './http-client';

export function composeClientFactories<
  U1 extends HttpEndpoints,
  T1,
  U2 extends HttpEndpoints,
  T2,
>(
  client1: HttpClientFactory<U1, T1>,
  client2: HttpClientFactory<U2, T2>,
): HttpClientFactory<U1 | U2, T1 & T2> {
  return function (req?: IncomingMessage) {
    return {
      ...client1(req),
      ...client2(req),
    };
  };
}
