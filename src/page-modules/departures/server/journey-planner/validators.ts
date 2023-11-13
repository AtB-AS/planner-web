import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/components/transport-mode/types';
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
  transportMode: TransportModeType.array().optional(),
  transportSubmode: TransportSubmodeType.array().optional(),
});

export const departureSchema = z.object({
  id: z.string(),
  name: z.string(),
  publicCode: z.string(),
  date: z.string(),
  aimedDepartureTime: z.string(),
  expectedDepartureTime: z.string(),
  transportMode: TransportModeType.optional(),
  transportSubmode: TransportSubmodeType.optional(),
});

export const quaySchema = z.object({
  publicCode: z.string().nullable(),
  name: z.string(),
  id: z.string(),
  description: z.string().nullable(),
  departures: z.array(departureSchema),
});

export const departureDataSchema = z.object({
  stopPlace: stopPlaceSchema,
  quays: z.array(quaySchema),
});

const stopPlaceWithDistance = z.object({
  stopPlace: stopPlaceSchema,
  distance: z.number(),
});

export const estimatedCallsSchema = z.object({
  quay: z.object({ id: z.string() }),
  departures: z.array(departureSchema),
});

export const serviceJourneySchema = z.object({
  id: z.string(),
  transportMode: TransportModeType,
  transportSubmode: TransportSubmodeType.optional(),
  line: z.object({
    publicCode: z.string(),
  }),
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
        }),
      }),
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
