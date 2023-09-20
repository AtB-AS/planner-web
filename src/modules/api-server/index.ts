import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { HttpEndpoints, createRequester, type Requester } from './utils';

export {
  ApplicationError,
  errorResultAsJson,
  genericError,
  logApplicationError,
  logError,
  tryResult,
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
  extra: {
    client: HttpClient<U, T>;
    ok: (a: P) => void;
  },
) => unknown | Promise<unknown>;

export function createWithHttpClientDecoratorForHttpHandlers<
  U extends HttpEndpoints,
  T,
>(client: HttpClient<U, T>) {
  return function inside<P>(handler: NextApiClientHandler<U, T, P>) {
    return (req: NextApiRequest, res: NextApiResponse<P>) => {
      function ok(val: P) {
        res.status(200).json(val);
      }
      return handler(req, res, { client, ok });
    };
  };
}
