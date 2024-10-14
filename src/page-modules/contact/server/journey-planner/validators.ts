import { transportModeSchema } from '@atb/modules/transport-mode';
import { z } from 'zod';

export const lineSchema = z.object({
  id: z.string(),
  name: z.string(),
  publicCode: z.string().nullable(),
  transportMode: transportModeSchema.nullable(),
  quays: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

export const linesSchema = z.array(lineSchema);

export type Line = z.infer<typeof lineSchema>;
