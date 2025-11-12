import { languageAndTextSchema } from '@atb/translations/types';
import { z } from 'zod';

const messageModeSchema = z.union([
  z.literal('info'),
  z.literal('valid'),
  z.literal('warning'),
  z.literal('error'),
]);

/**
 * Defines **valid** and **relevant** values for the context field
 *
 * There are other possible values for this enum, but only the relevant values
 * for the planner-web are listed here. Others are filtered out in the
 * globalMessageTypeSchema.context below.
 */
export enum GlobalMessageContextEnum {
  plannerWeb = 'planner-web',
  plannerWebDepartures = 'planner-web-departures',
  plannerWebDeparturesDetails = 'planner-web-departures-details',
  plannerWebTrip = 'planner-web-trip',
  plannerWebDetails = 'planner-web-details',
}

export const globalMessageTypeSchema = z.object({
  id: z.string(),
  active: z.boolean(),
  title: z.array(languageAndTextSchema).optional(),
  body: z.array(languageAndTextSchema),
  type: messageModeSchema,
  subtle: z.boolean().default(false),
  context: z
    .array(z.string())
    .transform((arr) =>
      arr.filter((val): val is GlobalMessageContextEnum =>
        Object.values(GlobalMessageContextEnum).includes(
          val as GlobalMessageContextEnum,
        ),
      ),
    ),
  isDismissable: z.boolean().default(false),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  link: z.array(languageAndTextSchema).optional(),
  linkText: z.array(languageAndTextSchema).optional(),
});

export type GlobalMessageType = z.infer<typeof globalMessageTypeSchema>;
