import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

export const infoLinkSchema = z.object({
  uri: z.string(),
  label: z.string().optional(),
});

export const situationSchema = z.object({
  id: z.string(),
  situationNumber: z.string().optional(),
  reportType: z.enum(['general', 'incident']).optional(),
  summary: z.array(languageAndTextSchema),
  description: z.array(languageAndTextSchema),
  advice: z.array(languageAndTextSchema),
  infoLinks: z.array(infoLinkSchema).optional(),
  validityPeriod: z
    .object({
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    })
    .optional(),
});

export const noticeSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
});

export type Notice = z.infer<typeof noticeSchema>;
export type Situation = z.infer<typeof situationSchema>;
