import { z } from "zod";

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

export const propertiesSchema = z.object({
  id: z.string(),
  gid: z.string(),
  layer: z.string(),
  source: z.string(),
  source_id: z.string(),
  name: z.string(),
  street: z.string().optional(),
  accuracy: z.string(),
  country_a: z.string(),
  county: z.string(),
  county_gid: z.string(),
  locality: z.string(),
  locality_gid: z.string(),
  borough: z.string().optional(),
  borough_gid: z.string().optional(),
  label: z.string(),
  category: z.array(z.string()),
  tariff_zones: z.array(z.string()).optional(),
});

export const querySchema = z.object({
  text: z.string(),
  parser: z.string(),
  tokens: z.array(z.string()),
  size: z.number(),
  layers: z.array(z.string()),
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

export const autocompleteRootSchema = z.object({
  geocoding: geocodingSchema,
  type: z.string(),
  features: z.array(featureSchema),
  bbox: z.array(z.number()),
});

export type AutocompleteRoot = z.infer<typeof autocompleteRootSchema>;
