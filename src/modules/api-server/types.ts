import { IncomingHttpHeaders, IncomingMessage } from 'http';

export const externalHttpUrls = {
  entur: 'https://api.entur.io',
} as const;

export type HttpEndpoints = keyof typeof externalHttpUrls;

export type ReqWithHeaders = {
  headers: IncomingHttpHeaders;
};

export type Requester<T extends HttpEndpoints> = (
  url: `/${string}`,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type HttpClient<U extends HttpEndpoints, T> = T & {
  request: Requester<U>;
};
export type HttpClientFactory<U extends HttpEndpoints, T> = (
  req?: IncomingMessage,
) => HttpClient<U, T>;
