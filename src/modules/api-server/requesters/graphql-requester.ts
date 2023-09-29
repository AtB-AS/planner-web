import { InMemoryCache } from '@apollo/client/cache';
import { ApolloLink, DefaultOptions, HttpLink } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { v4 as uuidv4 } from 'uuid';
import { logResponse } from './log-response';
import { Timer } from './timer';
import {
  GraphQlRequester,
  GraphQlEndpoints,
  ReqWithHeaders,
  externalGraphQlEndpoints,
} from './types';
import { getEtNameHeaders, passOnHeadersFromRequest } from './utils';

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

export const externalHttpUrls = {
  entur: 'https://api.entur.io',
} as const;

const cache = new InMemoryCache();

export function createGraphQlRequester<T extends GraphQlEndpoints>(
  baseUrlKey: T,
  req?: ReqWithHeaders,
): GraphQlRequester<T> {
  // Pass on from the potentially incoming request.
  const headers = passOnHeadersFromRequest(req, {
    'X-Correlation-Id': uuidv4(),
  });

  const uri = externalGraphQlEndpoints[baseUrlKey];

  const httpLink = new HttpLink({
    uri,

    headers: {
      ...getEtNameHeaders(),
      ...headers,
    },
  });

  const errorLink = onError((error) =>
    console.log('Apollo Error:', JSON.stringify(error)),
  );

  const loggingLink = new ApolloLink((operation, forward) => {
    operation.setContext({ start: new Date() });
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const timer = new Timer(operation.getContext().start);

      logResponse({
        operationName: operation.operationName,
        message: 'graphql call',
        url: context.response.url,
        statusCode: context.response.status,
        requestHeaders: headers,
        responseHeaders: context.response.headers,
        duration: timer.getElapsedMs(),
      });

      return response;
    });
  });
  const link = ApolloLink.from([loggingLink, errorLink, httpLink]);

  return new GraphQlRequester(baseUrlKey, {
    link,
    cache,
    defaultOptions,
  });
}
