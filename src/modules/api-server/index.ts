import { IncomingMessage } from 'http';
import {
  HttpRequester,
  ApplicationError,
  AllEndpoints,
  GraphQlRequester,
} from './requesters/types';

export { genericError, tryResult, errorResultAsJson } from './requesters/utils';

import { ExternalClient, ExternalClientFactory } from './external-client';

export type {
  AllEndpoints,
  HttpRequester,
  ExternalClient,
  ExternalClientFactory,
};

export { GraphQlRequester, ApplicationError };

export {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from './external-client';

// Helper types for composing client factories
type UnionEndpoints<
  Factories extends readonly ExternalClientFactory<any, any>[],
> = Factories extends [ExternalClientFactory<infer E, any>, ...infer Rest]
  ?
      | E
      | (Rest extends readonly ExternalClientFactory<any, any>[]
          ? UnionEndpoints<Rest>
          : never)
  : never;

type IntersectClients<
  Factories extends readonly ExternalClientFactory<any, any>[],
> = Factories extends [ExternalClientFactory<any, infer C>, ...infer Rest]
  ? C &
      (Rest extends readonly ExternalClientFactory<any, any>[]
        ? IntersectClients<Rest>
        : {})
  : {};

// Type-safe compose function that works with any number of factories
export function composeClientFactories<
  Factories extends readonly ExternalClientFactory<any, any>[],
>(
  ...factories: Factories
): ExternalClientFactory<
  UnionEndpoints<Factories>,
  IntersectClients<Factories>
> {
  return function (req?: IncomingMessage) {
    return factories.reduce((result, factory) => {
      return {
        ...result,
        ...factory(req),
      };
    }, {}) as IntersectClients<Factories>;
  };
}
