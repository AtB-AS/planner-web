import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { z } from 'zod';

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  transportModes: TransportModeFilterOption[] | null;
  cursor?: string;
} & (
  | {
      arriveBy: Date;
    }
  | {
      departBy: Date;
    }
);

export const TripQuerySchema = z.object({
  fromId: z.string(),
  fromLon: z.string(),
  fromLat: z.string(),
  fromLayer: z.union([z.literal('address'), z.literal('venue')]),
  toId: z.string(),
  toLon: z.string(),
  toLat: z.string(),
  toLayer: z.union([z.literal('address'), z.literal('venue')]),
  filter: z.string().optional(),
  arriveBy: z.string().optional(),
  departBy: z.string().optional(),
  cursor: z.string().optional(),
});

export type TripQuery = z.infer<typeof TripQuerySchema>;
