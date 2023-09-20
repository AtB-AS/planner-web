import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { createRequester, HttpEndpoints, type Requester } from './utils';
export {
  ApplicationError,
  logApplicationError,
  logError,
  genericError,
} from './utils';

export type { Requester };

export type HttpClient<U extends HttpEndpoints, T> = T & {
  request: Requester<U>;
};

type HttpPropGetter<U extends HttpEndpoints, T, P extends {} = {}> = (
  context: GetServerSidePropsContext & { client: HttpClient<U, T> },
) => Promise<GetServerSidePropsResult<P>>;

export function createHttpClient<T, U extends HttpEndpoints>(
  baseUrlType: U,
  apiFn: (request: Requester<U>) => T,
): HttpClient<U, T> {
  const request = createRequester(baseUrlType, undefined);

  return {
    ...apiFn(request),
    request,
  };
}

export function createWithHttpClientDecorator<U extends HttpEndpoints, T>(
  client: HttpClient<U, T>,
) {
  return function handler<P extends {} = {}>(
    propGetter: HttpPropGetter<U, T, P>,
  ) {
    return async function inside(
      ctx: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<P>> {
      return propGetter({
        ...ctx,
        client,
      });
    };
  };
}

// const externalGraphqlUrls = {
//   entur: "https://api.entur.io/journey-planner/v3/graphql/",
// } as const;

// export function createGraphqlClient(
//   baseUrlType: keyof typeof externalGraphqlUrls
// ) {
//   const baseUrl = externalHttpUrls[baseUrlType];
// }
