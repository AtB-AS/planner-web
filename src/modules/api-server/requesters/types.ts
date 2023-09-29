import { TranslatedString } from '@atb/translations';
import { IncomingHttpHeaders } from 'http';
import { NextApiResponse } from 'next';

import type { NormalizedCacheObject } from '@apollo/client/cache';
import { ApolloClient, type ApolloClientOptions } from '@apollo/client/core';

export const externalHttpUrls = {
  'http-entur': 'https://api.entur.io',
} as const;

export type HttpEndpoints = keyof typeof externalHttpUrls;

export const externalGraphQlEndpoints = {
  'graphql-journeyPlanner3': 'https://api.entur.io/journey-planner/v3/graphql',
} as const;

export type GraphQlEndpoints = keyof typeof externalGraphQlEndpoints;

export type AllEndpoints = HttpEndpoints | GraphQlEndpoints;

export type ReqWithHeaders = {
  headers: IncomingHttpHeaders;
};

export class GraphQlRequester<
  T extends GraphQlEndpoints,
> extends ApolloClient<NormalizedCacheObject> {
  public endpoint: T;

  constructor(
    endpoint: T,
    options: ApolloClientOptions<NormalizedCacheObject>,
  ) {
    super(options);
    this.endpoint = endpoint;
  }
}

export type HttpRequester<T extends HttpEndpoints> = (
  url: `/${string}`,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type ConditionalRequester<U extends AllEndpoints> =
  U extends HttpEndpoints
    ? HttpRequester<U>
    : U extends GraphQlEndpoints
    ? GraphQlRequester<U>
    : never;

export function isGraphQlEndpoint(a: any): a is GraphQlEndpoints {
  return a in externalGraphQlEndpoints;
}

export type ServerErrorMessage = {
  message: TranslatedString;
};

export class ApplicationError extends Error {
  data: ServerErrorMessage;
  status: number;
  correlationId?: string;
  upstreamResponse?: Response | NextApiResponse<any>;

  constructor(
    error: ServerErrorMessage,
    status: number = 500,
    correlationId?: string,
    upstreamResponse?: Response | NextApiResponse<any>,
  ) {
    super();
    this.data = error;
    this.status = status;
    this.correlationId = correlationId;
    this.upstreamResponse = upstreamResponse;
  }
}
