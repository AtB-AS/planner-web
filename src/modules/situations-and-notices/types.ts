import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

export const infoLinkSchema = z.object({
  uri: z.string(),
  label: z.string().nullable(),
});

export const situationSchema = z.object({
  id: z.string(),
  situationNumber: z.string().nullable(),
  reportType: z.enum(['general', 'incident']).nullable(),
  summary: z.array(languageAndTextSchema),
  description: z.array(languageAndTextSchema),
  advice: z.array(languageAndTextSchema),
  infoLinks: z.array(infoLinkSchema).nullable(),
  validityPeriod: z
    .object({
      startTime: z.string().nullable(),
      endTime: z.string().nullable(),
    })
    .nullable(),
});

export const noticeSchema = z.object({
  id: z.string(),
  text: z.string().nullable(),
});

export type Notice = z.infer<typeof noticeSchema>;
export type Situation = z.infer<typeof situationSchema>;
