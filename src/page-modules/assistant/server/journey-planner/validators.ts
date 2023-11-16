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
export const serviceJourneyEstimatedCallSchema = z.object({
  actualDepartureTime: z.string(),
  realtime: z.boolean(),
  aimedDepartureTime: z.string(),
  expectedDepartureTime: z.string(),
  predictionInaccurate: z.boolean(),
  quay: z.object({
    name: z.string(),
  }),
});
export const datedServiceJourneySchema = z.object({
  estimatedCalls: z.array(
    z.object({
      actualDepartureTime: z.string(),
      predictionInaccurate: z.boolean(),
      quay: z.object({
        name: z.string(),
      }),
    }),
  ),
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
  longitude: z.number(),
  latitude: z.number(),
  quay: quaySchema.nullable(),
});

export const fromEstimatedCallSchema = z.object({
  aimedDepartureTime: z.string(),
  expectedDepartureTime: z.string(),
  destinationDisplay: z.object({ frontText: z.string().nullable() }).nullable(),
  quay: z.object({ publicCode: z.string().nullable(), name: z.string() }),
  notices: z.array(noticeSchema).optional(),
});

export const lineSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  transportSubmode: transportSubmodeSchema.nullable().optional(),
  publicCode: z.string().nullable(),
  flexibleLineType: z.string().nullable(),
  notices: z.array(noticeSchema),
});

export const legSchema = z.object({
  mode: transportModeSchema.nullable(),
  distance: z.number(),
  duration: z.number(),
  aimedStartTime: z.string(),
  aimedEndTime: z.string(),
  expectedEndTime: z.string(),
  expectedStartTime: z.string(),
  realtime: z.boolean(),
  transportSubmode: transportSubmodeSchema.nullable().optional(),
  line: lineSchema.nullable(),
  fromEstimatedCall: fromEstimatedCallSchema.nullable(),
  situations: z.array(situationSchema),
  fromPlace: placeSchema,
  toPlace: placeSchema,
  serviceJourney: serviceJourneySchema.nullable(),
  rentedBike: z.boolean().nullable(),
  interchangeTo: z
    .object({
      guaranteed: z.boolean(),
      toServiceJourney: z
        .object({
          id: z.string(),
        })
        .nullable(),
    })
    .nullable(),
  pointsOnLink: z
    .object({
      points: z.string(),
      length: z.number(),
    })
    .nullable(),
  intermediateEstimatedCalls: z.array(
    z.object({
      date: z.string(),
      quay: z.object({
        name: z.string(),
        id: z.string(),
      }),
    }),
  ),
  authority: z.object({ id: z.string() }).nullable(),
  serviceJourneyEstimatedCalls: z
    .array(serviceJourneyEstimatedCallSchema)
    .nullable(),
  datedServiceJourney: datedServiceJourneySchema.nullable(),
});

export const tripPatternSchema = z.object({
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
  duration: z.number(),
  walkDistance: z.number(),
  legs: z.array(legSchema),
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

export type TripData = z.infer<typeof tripSchema>;
export type NonTransitData = z.infer<typeof nonTransitSchema>;
export type TripPattern = z.infer<typeof tripPatternSchema>;
export type Leg = z.infer<typeof legSchema>;
export type Quay = z.infer<typeof quaySchema>;
