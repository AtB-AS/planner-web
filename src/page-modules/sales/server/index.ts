import {
  createExternalClient,
  createWithExternalClientDecorator,
  createWithExternalClientDecoratorForHttpHandlers,
} from '@atb/modules/api-server';
import { createSalesSearchApi } from './search';

const salesSearchClient = createExternalClient(
  'http-sales',
  createSalesSearchApi,
);

export const withSalesClient =
  createWithExternalClientDecorator(salesSearchClient);

export type SalesClient = ReturnType<typeof salesSearchClient>;

export const handlerWithSalesClient =
  createWithExternalClientDecoratorForHttpHandlers(salesSearchClient);
