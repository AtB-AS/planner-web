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
export const tariffZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
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

export const tripPatternWithDetailsSchema = z.object({
  expectedStartTime: z.string(),
  expectedEndTime: z.string(),
  walkDistance: z.number(),
  legs: z.array(
    z.object({
      mode: transportModeSchema,
      transportSubmode: transportSubmodeSchema,
      aimedStartTime: z.string(),
      aimedEndTime: z.string(),
      expectedStartTime: z.string(),
      expectedEndTime: z.string(),
      realtime: z.boolean(),
      duration: z.number(),
      mapLegs: z.array(mapLegSchema),
      line: z
        .object({
          name: z.string(),
          publicCode: z.string().nullable(),
          flexibleLineType: z.string().nullable(),
        })
        .nullable(), // line is null for legs with transportMode = foot
      fromPlace: z.object({
        name: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        quay: z
          .object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            publicCode: z.string().nullable(),
          })
          .nullable(), // quay is null when fromPlace is a POI (e.g. address)
      }),
      toPlace: z.object({
        name: z.string(),
        quay: z
          .object({
            name: z.string(),
            description: z.string().nullable(),
            publicCode: z.string().nullable(),
          })
          .nullable(), // quay is null when toPlace is a POI (e.g. address)
      }),
      serviceJourney: z
        .object({
          id: z.string(),
        })
        .nullable(),
      fromEstimatedCall: z
        .object({
          destinationDisplay: z.object({ frontText: z.string() }).optional(),
          cancellation: z.boolean(),
        })
        .nullable(),
      interchangeTo: z
        .object({
          guaranteed: z.boolean(),
          maximumWaitTime: z.number(),
          staySeated: z.boolean().optional(),
          toServiceJourney: z.object({ id: z.string() }),
        })
        .nullable(),
      numberOfIntermediateEstimatedCalls: z.number(),
      notices: z.array(noticeSchema),
      situations: z.array(situationSchema),
      serviceJourneyEstimatedCalls: z.array(
        z.object({
          aimedDepartureTime: z.string(),
          expectedDepartureTime: z.string(),
          actualDepartureTime: z.string().nullable(),
          quay: z.object({
            name: z.string(),
            description: z.string().nullable(),
          }),
          realtime: z.boolean(),
          cancellation: z.boolean(),
        }),
      ),
      bookingArrangements: bookingArrangementSchema.nullable(),
    }),
  ),
});

export const linesSchema = z.record(z.array(z.string()));

export type TripData = z.infer<typeof tripSchema>;
export type NonTransitData = z.infer<typeof nonTransitSchema>;
export type TripPattern = z.infer<typeof tripPatternSchema>;
export type Leg = z.infer<typeof legSchema>;
export type Quay = z.infer<typeof quaySchema>;
export type TripPatternWithDetails = z.infer<
  typeof tripPatternWithDetailsSchema
>;
export type LineData = z.infer<typeof linesSchema>;
