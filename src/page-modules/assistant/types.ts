import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { z } from 'zod';

export enum DepartureMode {
  DepartBy = 'departBy',
  ArriveBy = 'arriveBy',
}

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  departureMode: DepartureMode;
  departureDate?: number;
  transportModes?: TransportModeFilterOption[];
  cursor?: string;
};

export const TripQuerySchema = z.object({
  fromId: z.string(),
  fromLon: z.number(),
  fromLat: z.number(),
  fromLayer: z.union([z.literal('address'), z.literal('venue')]),
  toId: z.string(),
  toLon: z.number(),
  toLat: z.number(),
  toLayer: z.union([z.literal('address'), z.literal('venue')]),
  filter: z.string().optional(),
  departureDate: z.number().optional(),
  departureMode: z.nativeEnum(DepartureMode),
  cursor: z.string().optional(),
});

export type TripQuery = z.infer<typeof TripQuerySchema>;
