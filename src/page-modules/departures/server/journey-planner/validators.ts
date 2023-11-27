import { mapLegSchema } from '@atb/modules/map';
import { noticeSchema, situationSchema } from '@atb/modules/situations';
import {
  transportModeSchema,
  transportSubmodeSchema,
} from '@atb/modules/transport-mode';
import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export const stopPlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  position: locationSchema,
  transportMode: transportModeSchema.array().optional(),
  transportSubmode: transportSubmodeSchema.array().optional(),
});

export const departureSchema = z.object({
  id: z.string(),
  name: z.string(),
  publicCode: z.string(),
  date: z.string(),
  aimedDepartureTime: z.string(),
  expectedDepartureTime: z.string(),
  cancelled: z.boolean(),
  transportMode: transportModeSchema.optional(),
  transportSubmode: transportSubmodeSchema.optional(),
  notices: z.array(noticeSchema),
  situations: z.array(situationSchema),
});

export const quaySchema = z.object({
  publicCode: z.string().nullable(),
  name: z.string(),
  id: z.string(),
  description: z.string().nullable(),
  departures: z.array(departureSchema),
  situations: z.array(situationSchema),
});

export const departureDataSchema = z.object({
  stopPlace: stopPlaceSchema,
  quays: z.array(quaySchema),
});

const stopPlaceWithDistance = z.object({
  stopPlace: stopPlaceSchema.extend({
    situations: z.array(situationSchema),
  }),
  distance: z.number(),
});

export const estimatedCallsSchema = z.object({
  quay: z.object({ id: z.string() }),
  departures: z.array(departureSchema),
});

export const serviceJourneySchema = z.object({
  id: z.string(),
  transportMode: transportModeSchema,
  transportSubmode: transportSubmodeSchema.optional(),
  line: z.object({
    publicCode: z.string(),
    notices: z.array(noticeSchema),
  }),
  mapLegs: z.array(mapLegSchema),
  notices: z.array(noticeSchema),
  estimatedCalls: z.array(
    z.object({
      actualArrivalTime: z.string().nullable(),
      actualDepartureTime: z.string().nullable(),
      aimedArrivalTime: z.string(),
      aimedDepartureTime: z.string(),
      cancellation: z.boolean(),
      date: z.string(),
      destinationDisplay: z.object({ frontText: z.string() }),
      expectedDepartureTime: z.string(),
      expectedArrivalTime: z.string(),
      forAlighting: z.boolean(),
      forBoarding: z.boolean(),
      realtime: z.boolean(),
      quay: z.object({
        publicCode: z.string().nullable(),
        name: z.string(),
        id: z.string(),
        stopPlace: z.object({
          id: z.string(),
          longitude: z.number(),
          latitude: z.number(),
        }),
      }),
      notices: z.array(noticeSchema),
      situations: z.array(situationSchema),
    }),
  ),
});

export type DepartureData = z.infer<typeof departureDataSchema>;
export type StopPlaceInfo = z.infer<typeof stopPlaceSchema>;
export const nearestStopPlaces = z.array(stopPlaceWithDistance);
export type StopPlaceWithDistance = z.infer<typeof stopPlaceWithDistance>;
export type NearestStopPlacesData = z.infer<typeof nearestStopPlaces>;
export type EstimatedCallsData = z.infer<typeof estimatedCallsSchema>;
export type Departure = z.infer<typeof departureSchema>;
export type Quay = z.infer<typeof quaySchema>;
export type ServiceJourneyData = z.infer<typeof serviceJourneySchema>;
