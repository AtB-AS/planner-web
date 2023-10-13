import { z } from 'zod';
import { TransportModeType, TransportSubmodeType } from '@atb-as/config-specs';

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

export type DepartureData = z.infer<typeof departureDataSchema>;
export type StopPlaceInfo = z.infer<typeof stopPlaceSchema>;

const stopPlaceWithDistance = z.object({
  stopPlace: stopPlaceSchema,
  distance: z.number(),
});

export const nearestStopPlaces = z.array(stopPlaceWithDistance);
export type StopPlaceWithDistance = z.infer<typeof stopPlaceWithDistance>;
export type NearestStopPlacesData = z.infer<typeof nearestStopPlaces>;
