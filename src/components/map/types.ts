import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';
import z from 'zod';

export const positionSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type PositionType = z.infer<typeof positionSchema>;

export const mapLegSchema = z.object({
  transportMode: transportModeSchema,
  transportSubmode: transportSubmodeSchema.optional(),
  faded: z.boolean(),
  points: z.array(positionSchema),
  isFlexibleLine: z.boolean(),
});

export type MapLegType = z.infer<typeof mapLegSchema>;
