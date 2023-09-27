import { ServerText } from '@atb/translations';
import { IncomingMessage } from 'http';
import { constants } from 'http2';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  HttpEndpoints,
  createRequester,
  errorResultAsJson,
  type Requester,
} from './utils';

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
export type HttpClientFactory<U extends HttpEndpoints, T> = (
  req?: IncomingMessage,
) => HttpClient<U, T>;

type HttpPropGetter<U extends HttpEndpoints, T, P extends {} = {}> = (
  context: GetServerSidePropsContext & { client: HttpClient<U, T> },
) => Promise<GetServerSidePropsResult<P>>;

export function createHttpClient<T, U extends HttpEndpoints>(
  baseUrlType: U,
  apiFn: (request: Requester<U>) => T,
): HttpClientFactory<U, T> {
  return function (req?: IncomingMessage) {
    let request = createRequester(baseUrlType, req);

    return {
      ...apiFn(request),
      request,
    };
  };
}

export function createWithHttpClientDecorator<U extends HttpEndpoints, T>(
  clientCreate: HttpClientFactory<U, T>,
) {
  return function handler<P extends {} = {}>(
    propGetter: HttpPropGetter<U, T, P>,
  ) {
    return async function inside(
      ctx: GetServerSidePropsContext,
    ): Promise<GetServerSidePropsResult<P>> {
      return propGetter({
        client: clientCreate(ctx.req),
        ...ctx,
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

type EndpointMapping<U extends HttpEndpoints, T, P = any> = Partial<
  Record<'GET' | 'POST' | 'DELETE' | 'PUT', NextApiClientHandler<U, T, P>>
>;

type ApiHandler<U extends HttpEndpoints, T, P = any> =
  | NextApiClientHandler<U, T, P>
  | EndpointMapping<U, T, P>;

export function createWithHttpClientDecoratorForHttpHandlers<
  U extends HttpEndpoints,
  T,
>(createClient: HttpClientFactory<U, T>) {
  return function inside<P>(handler: ApiHandler<U, T, P>) {
    return (req: NextApiRequest, res: NextApiResponse<P>) => {
      function ok(val: P) {
        res.status(200).json(val);
      }

      if (isRecordHandler(handler)) {
        const potential = Object.entries(handler).find(
          ([method]) => req.method === method,
        );
        if (potential) {
          const [, properHandle] = potential;
          return properHandle(req, res, { client: createClient(req), ok });
        }
      } else if (isFunction(handler)) {
        return handler(req, res, { client: createClient(req), ok });
      }

      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_METHOD_NOT_ALLOWED,
        ServerText.Endpoints.invalidMethod,
      );
    };
  };
}

function isRecordHandler<U extends HttpEndpoints, T, P = any>(
  handlers: any,
): handlers is EndpointMapping<U, T, P> {
  return Object.keys(handlers).some((m) =>
    ['GET', 'POST', 'DELETE', 'PUT'].includes(m),
  );
}

function isFunction<U extends HttpEndpoints, T, P = any>(
  fn: any,
): fn is NextApiClientHandler<U, T, P> {
  return fn && {}.toString.call(fn) === '[object Function]';
}
