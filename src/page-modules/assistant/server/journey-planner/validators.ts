import { z } from 'zod';
import { transportModeSchema } from '@atb/modules/transport-mode';

export const nonTransitSchema = z.object({
  mode: transportModeSchema,
  rentedBike: z.boolean(),
  duration: z.number(),
  compressedQuery: z.string(),
});

export const linesSchema = z.record(z.array(z.string()));

export type NonTransitData = z.infer<typeof nonTransitSchema>;
export type LineData = z.infer<typeof linesSchema>;
