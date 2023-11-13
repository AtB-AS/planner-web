import { z } from 'zod';

export const transportModeFilterSchema = z.union([
  z.literal('bus'),
  z.literal('rail'),
  z.literal('expressboat'),
  z.literal('ferry'),
  z.literal('airportbus'),
  z.literal('air'),
  z.literal('other'),
]);

export type TransportModeFilterOption = z.infer<
  typeof transportModeFilterSchema
>;

export type TransportModeFilterState = Record<
  TransportModeFilterOption,
  boolean
>;

export { TransportModeFilterOptionType } from '@atb-as/config-specs';
