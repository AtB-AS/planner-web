import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export const stopPlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: locationSchema,
});

export const departureSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const quaySchema = z.object({
  publicCode: z.string(),
  name: z.string(),
  id: z.string(),
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
