import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

const messageModeSchema = z.union([
  z.literal('info'),
  z.literal('valid'),
  z.literal('warning'),
  z.literal('error'),
]);

export enum GlobalMessageContextEnum {
  plannerWebAssistant = 'planner-web-assistant',
}

export const globalMessageTypeSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  title: z.array(languageAndTextSchema).optional(),
  body: z.array(languageAndTextSchema),
  type: messageModeSchema,
  subtle: z.boolean().default(false),
  context: z.array(z.nativeEnum(GlobalMessageContextEnum)),
  isDismissable: z.boolean().default(false),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type GlobalMessageType = z.infer<typeof globalMessageTypeSchema>;
