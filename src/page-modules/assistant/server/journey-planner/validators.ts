import { TransportModeType, TransportSubmodeType } from '@atb-as/config-specs';
import { z } from 'zod';
export const noticeSchema = z.object({
  id: z.string(),
  text: z.string().nullable(),
});

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
export const languageAndTextSchema = z.object({
  language: z.string().nullable(),
  value: z.string(),
});
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

export const placeSchema = z.object({
  name: z.string().nullable(),
  longitude: z.number(),
  latitude: z.number(),
  quay: z
    .object({
      publicCode: z.string().nullable(),
      name: z.string(),
      id: z.string(),
      situations: z.array(situationSchema),
    })
    .nullable(),
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
  transportSubmode: TransportSubmodeType.nullable(),
  publicCode: z.string().nullable(),
  flexibleLineType: z.string().nullable(),
  notices: z.array(noticeSchema),
});

export const legSchema = z.object({
  mode: TransportModeType.nullable(),
  distance: z.number(),
  duration: z.number(),
  aimedStartTime: z.string(),
  aimedEndTime: z.string(),
  expectedEndTime: z.string(),
  expectedStartTime: z.string(),
  realtime: z.boolean(),
  transportSubmode: TransportSubmodeType.nullable(),
  line: lineSchema.nullable(),
  fromEstimatedCall: fromEstimatedCallSchema.nullable(),
  situations: z.array(situationSchema),
  fromPlace: placeSchema,
  toPlace: placeSchema,
  serviceJourney: serviceJourneySchema.nullable(),
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
  tripPatterns: z.array(tripPatternSchema),
});

export type Notice = z.infer<typeof noticeSchema>;
export type Situation = z.infer<typeof situationSchema>;
export type TripData = z.infer<typeof tripSchema>;
