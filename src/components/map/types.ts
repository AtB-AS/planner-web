import { z } from 'zod';
import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';

export type Position = {
  lon: number;
  lat: number;
};

export const mapLegSchema = z.object({
  transportMode: transportModeSchema,
  transportSubmode: transportSubmodeSchema.optional(),
  faded: z.boolean(),
  points: z.array(z.array(z.number(), z.number())),
});

export type MapLegType = z.infer<typeof mapLegSchema>;
