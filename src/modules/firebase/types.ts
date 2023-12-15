import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

export const tariffZoneSchema = z.object({
  geometry: z.object({
    coordinates: z.array(z.array(z.array(z.number()))),
    type: z.string(),
  }),
  id: z.string(),
  name: languageAndTextSchema,
  version: z.string(),
  isDefault: z.boolean().optional(),
});

export type TariffZone = z.infer<typeof tariffZoneSchema>;
