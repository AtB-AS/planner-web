import { z } from 'zod';

export const langSchema = z.object({
  name: z.string(),
  iso6391: z.string(),
  iso6393: z.string(),
  defaulted: z.boolean(),
});

export const engineSchema = z.object({
  name: z.string(),
  author: z.string(),
  version: z.string(),
});

export const geometrySchema = z.object({
  type: z.string(),
  coordinates: z.array(z.number()),
});

export const layerSchema = z.union([z.literal('address'), z.literal('venue')]);

export const propertiesSchema = z.object({
  id: z.string(),
  gid: z.string(),
  layer: layerSchema,
  source: z.string(),
  source_id: z.string(),
  name: z.string(),
  street: z.string().optional(),
  accuracy: z.string(),
  country_a: z.string().optional(),
  county: z.string().optional(),
  county_gid: z.string().optional(),
  locality: z.string().optional(),
  locality_gid: z.string().optional(),
  borough: z.string().optional(),
  borough_gid: z.string().optional(),
  label: z.string(),
  category: z.array(z.string()),
  tariff_zones: z.array(z.string()).optional(),
});

export const querySchema = z.object({
  text: z.string().optional(),
  parser: z.string().optional(),
  tokens: z.array(z.string()).optional(),
  size: z.number(),
  layers: z.array(layerSchema),
  sources: z.array(z.string()),
  private: z.boolean(),
  lang: langSchema,
  querySize: z.number(),
});

export const featureSchema = z.object({
  type: z.string(),
  geometry: geometrySchema,
  properties: propertiesSchema,
});

export const geocodingSchema = z.object({
  version: z.string(),
  attribution: z.string(),
  query: querySchema,
  engine: engineSchema,
  timestamp: z.number(),
});

export const geocoderRootSchema = z.object({
  geocoding: geocodingSchema,
  type: z.string(),
  features: z.array(featureSchema),
  bbox: z.array(z.number()).optional(),
});

export type GeocoderRoot = z.infer<typeof geocoderRootSchema>;
export type Layer = z.infer<typeof layerSchema>;
