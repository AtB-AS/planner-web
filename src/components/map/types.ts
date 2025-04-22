import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';
import z from 'zod';
import { positionSchema } from '@atb/modules/position/types.ts';

export const mapLegSchema = z.object({
  transportMode: transportModeSchema,
  transportSubmode: transportSubmodeSchema.optional(),
  faded: z.boolean(),
  points: z.array(positionSchema),
  isFlexibleLine: z.boolean(),
});

export type MapLegType = z.infer<typeof mapLegSchema>;
