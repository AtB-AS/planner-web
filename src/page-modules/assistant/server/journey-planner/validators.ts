import { z } from 'zod';
import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';
import { noticeSchema, situationSchema } from '@atb/modules/situations';
import { mapLegSchema } from '@atb/components/map';
import { bookingArrangementSchema } from '@atb/modules/flexible';

export const serviceJourneySchema = z.object({
  id: z.string(),
  notices: z.array(noticeSchema),
  journeyPattern: z
    .object({
      notices: z.array(noticeSchema),
    })
    .nullable(),
});

export const quaySchema = z.object({
  publicCode: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  id: z.string(),
  situations: z.array(situationSchema),
});

export const placeSchema = z.object({
  name: z.string().nullable(),
  quay: quaySchema.nullable(),
});

export const estimatedCallSchema = z.object({
  cancellation: z.boolean(),
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
  fromEstimatedCall: estimatedCallSchema.nullable(),
  toEstimatedCall: estimatedCallSchema.nullable().optional(),
  situations: z.array(situationSchema),
  fromPlace: placeSchema,
  serviceJourney: serviceJourneySchema.nullable(),
  interchangeTo: z
    .object({
      staySeated: z.boolean().nullable(),
    })
    .nullable()
    .optional(),
});

export const tripPatternSchema = z.object({
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
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
  compressedQuery: z.string(),
});

export const linesSchema = z.record(z.array(z.string()));

export type TripData = z.infer<typeof tripSchema>;
export type NonTransitData = z.infer<typeof nonTransitSchema>;
export type TripPattern = z.infer<typeof tripPatternSchema>;
export type Quay = z.infer<typeof quaySchema>;
export type LineData = z.infer<typeof linesSchema>;
