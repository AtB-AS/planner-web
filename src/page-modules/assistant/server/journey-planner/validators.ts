import { z } from 'zod';
import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';
import { noticeSchema, situationSchema } from '@atb/modules/situations';

export const serviceJourneySchema = z.object({
  id: z.string(),
  notices: z.array(noticeSchema),
  journeyPattern: z
    .object({
      notices: z.array(noticeSchema),
    })
    .nullable(),
});
export const tariffZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const quaySchema = z.object({
  publicCode: z.string().nullable(),
  name: z.string(),
  id: z.string(),
  situations: z.array(situationSchema),
});

export const placeSchema = z.object({
  name: z.string().nullable(),
  quay: quaySchema.nullable(),
});

export const fromEstimatedCallSchema = z.object({
  notices: z.array(noticeSchema).optional(),
});

export const lineSchema = z.object({
  publicCode: z.string().nullable(),
  flexibleLineType: z.string().nullable(),
  notices: z.array(noticeSchema),
});

export const legSchema = z.object({
  mode: transportModeSchema.nullable(),
  distance: z.number(),
  duration: z.number(),
  aimedStartTime: z.string(),
  expectedEndTime: z.string(),
  expectedStartTime: z.string(),
  realtime: z.boolean(),
  transportSubmode: transportSubmodeSchema.nullable().optional(),
  line: lineSchema.nullable(),
  fromEstimatedCall: fromEstimatedCallSchema.nullable(),
  situations: z.array(situationSchema),
  fromPlace: placeSchema,
  serviceJourney: serviceJourneySchema.nullable(),
});

export const tripPatternSchema = z.object({
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
  duration: z.number(),
  walkDistance: z.number(),
  legs: z.array(legSchema),
  compressedQuery: z.string(),
});

export const tripSchema = z.object({
  nextPageCursor: z.string().nullable(),
  previousPageCursor: z.string().nullable(),
  tripPatterns: z.array(tripPatternSchema),
});

export const nonTransitSchema = z.object({
  mode: transportModeSchema,
  rentedBike: z.boolean(),
  duration: z.number(),
});

export const tripPatternWithDetailsSchema = z.object({
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
  legs: z.array(
    z.object({
      duration: z.number(),
      fromPlace: z.object({
        name: z.string(),
      }),
      toPlace: z.object({
        name: z.string(),
      }),
      serviceJourney: z.object({
        id: z.string().nullable(),
      }),
    }),
  ),
});

export type TripData = z.infer<typeof tripSchema>;
export type NonTransitData = z.infer<typeof nonTransitSchema>;
export type TripPattern = z.infer<typeof tripPatternSchema>;
export type Leg = z.infer<typeof legSchema>;
export type Quay = z.infer<typeof quaySchema>;
export type TripPatternWithDetails = z.infer<
  typeof tripPatternWithDetailsSchema
>;
