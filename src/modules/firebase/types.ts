import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

export const tariffZoneSchema = z.object({
  geometry: z.object({
    coordinates: z.array(z.array(z.array(z.number()))),
    type: z.literal('Polygon'),
  }),
  id: z.string(),
  name: languageAndTextSchema,
  version: z.string(),
  isDefault: z.boolean().optional(),
});

export const defaultFocusPointSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export type TariffZone = z.infer<typeof tariffZoneSchema>;
export type DefaultFocusPoint = z.infer<typeof defaultFocusPointSchema>;
