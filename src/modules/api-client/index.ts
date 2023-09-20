import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { HttpEndpoints, createRequester, type Requester } from './utils';

export {
  ApplicationError,
  genericError,
  logApplicationError,
  logError,
  tryResult,
  errorResultAsJson,
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
  let request = createRequester(baseUrlType);

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

export type NextApiClientHandler<U extends HttpEndpoints, T, P = any> = (
  req: NextApiRequest,
  res: NextApiResponse<P>,
  client: HttpClient<U, T>,
) => unknown | Promise<unknown>;

export function createWithHttpClientDecoratorForHttpHandlers<
  U extends HttpEndpoints,
  T,
  P,
>(client: HttpClient<U, T>) {
  return function inside(handler: NextApiClientHandler<U, T, P>) {
    return (req: NextApiRequest, res: NextApiResponse<P>) =>
      handler(req, res, client);
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
