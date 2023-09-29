import { ServerText } from '@atb/translations';
import type { IncomingMessage } from 'http';
import { constants } from 'http2';
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { createGraphQlRequester } from './requesters/graphql-requester';
import { createRequester } from './requesters/http-requester';
import {
  isGraphQlEndpoint,
  type AllEndpoints,
  type ConditionalRequester,
  type HttpEndpoints,
} from './requesters/types';
import { errorResultAsJson } from './requesters/utils';

type HttpPropGetter<U extends HttpEndpoints, T, P extends {} = {}> = (
  context: GetServerSidePropsContext & { client: ExternalClient<U, T> },
) => Promise<GetServerSidePropsResult<P>>;

export type ExternalClient<U extends AllEndpoints, T> = T & {
  client: ConditionalRequester<U>;
};
export type ExternalClientFactory<U extends AllEndpoints, T> = (
  req?: IncomingMessage,
) => ExternalClient<U, T>;

export function createExternalClient<U extends AllEndpoints, T>(
  baseUrlType: U,
  apiFn: (request: ConditionalRequester<U>) => T,
): ExternalClientFactory<U, T> {
  return function (req?: IncomingMessage) {
    if (isGraphQlEndpoint(baseUrlType)) {
      let client = createGraphQlRequester(baseUrlType, req);

      return {
        ...apiFn(client as ConditionalRequester<U>),
        client: client as ConditionalRequester<U>,
      };
    } else {
      let client = createRequester(baseUrlType, req);

      return {
        ...apiFn(client as ConditionalRequester<U>),
        client: client as ConditionalRequester<U>,
      };
    }
  };
}

export function createWithExternalClientDecorator<U extends HttpEndpoints, T>(
  clientCreate: ExternalClientFactory<U, T>,
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
    client: ExternalClient<U, T>;
    ok: (a: P) => void;
  },
) => unknown | Promise<unknown>;

type EndpointMapping<U extends HttpEndpoints, T, P = any> = Partial<
  Record<'GET' | 'POST' | 'DELETE' | 'PUT', NextApiClientHandler<U, T, P>>
>;

type ApiHandler<U extends HttpEndpoints, T, P = any> =
  | NextApiClientHandler<U, T, P>
  | EndpointMapping<U, T, P>;

export function createWithExternalClientDecoratorForHttpHandlers<
  U extends HttpEndpoints,
  T,
>(createClient: ExternalClientFactory<U, T>) {
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
