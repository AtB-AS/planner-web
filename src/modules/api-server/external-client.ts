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
} from './requesters/types';
import { errorResultAsJson } from './requesters/utils';
import { ParsedUrlQuery } from 'node:querystring';
import Cors from 'cors';

type HttpPropGetter<
  U extends AllEndpoints,
  T,
  P extends {} = {},
  Params extends ParsedUrlQuery = ParsedUrlQuery,
> = (
  context: GetServerSidePropsContext<Params> & { client: ExternalClient<U, T> },
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
      const client = createGraphQlRequester(baseUrlType, req);

      return {
        ...apiFn(client as ConditionalRequester<U>),
        client: client as ConditionalRequester<U>,
      };
    } else {
      const client = createRequester(baseUrlType, req);

      return {
        ...apiFn(client as ConditionalRequester<U>),
        client: client as ConditionalRequester<U>,
      };
    }
  };
}

export function createWithExternalClientDecorator<U extends AllEndpoints, T>(
  clientCreate: ExternalClientFactory<U, T>,
) {
  return function handler<
    P extends {} = {},
    Params extends ParsedUrlQuery = ParsedUrlQuery,
  >(propGetter: HttpPropGetter<U, T, P, Params>) {
    return async function inside(
      ctx: GetServerSidePropsContext<Params>,
    ): Promise<GetServerSidePropsResult<P>> {
      return propGetter({
        client: clientCreate(ctx.req),
        ...ctx,
      });
    };
  };
}

export type NextApiClientHandler<U extends AllEndpoints, T, P = any> = (
  req: NextApiRequest,
  res: NextApiResponse<P>,
  extra: {
    client: ExternalClient<U, T>;
    ok: (a: P) => void;
  },
) => unknown | Promise<unknown>;

type EndpointMapping<U extends AllEndpoints, T, P = any> = Partial<
  Record<'GET' | 'POST' | 'DELETE' | 'PUT', NextApiClientHandler<U, T, P>>
>;

type ApiHandler<U extends AllEndpoints, T, P = any> =
  | NextApiClientHandler<U, T, P>
  | EndpointMapping<U, T, P>;

export function createWithExternalClientDecoratorForHttpHandlers<
  U extends AllEndpoints,
  T,
>(createClient: ExternalClientFactory<U, T>) {
  return function inside<P>(
    handler: ApiHandler<U, T, P>,
    corsOrigin?: (string | RegExp)[],
  ) {
    return async (req: NextApiRequest, res: NextApiResponse<P>) => {
      function ok(val: P) {
        res.status(200).json(val);
      }

      if (corsOrigin) {
        const cors = Cors({
          methods: ['POST', 'GET', 'HEAD'],
          origin: corsOrigin,
        });

        await runMiddleware(req, res, cors);
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

function isRecordHandler<U extends AllEndpoints, T, P = any>(
  handlers: any,
): handlers is EndpointMapping<U, T, P> {
  return Object.keys(handlers).some((m) =>
    ['GET', 'POST', 'DELETE', 'PUT'].includes(m),
  );
}

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

function isFunction<U extends AllEndpoints, T, P = any>(
  fn: any,
): fn is NextApiClientHandler<U, T, P> {
  return fn && {}.toString.call(fn) === '[object Function]';
}
