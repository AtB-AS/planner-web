import z from 'zod';

export const positionSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type PositionType = z.infer<typeof positionSchema>;
