import { type PositionType } from '@atb/components/map';
import type { ParsedUrlQuery } from 'querystring';
import z from 'zod';

// Zoomed out enough to show several fare zones at once.
export const DEFAULT_ZONE_MAP_ZOOM = 9;

export type ZoneMapOptions = {
  // null when not set, the map then starts fitted to all fare zones.
  position: PositionType | null;
  zoom: number;
};

// Plain decimal numbers only, so values like " ", "0x10" or "1e2" are not
// coerced into unexpected numbers.
const DECIMAL_NUMBER = /^-?\d+(\.\d+)?$/;

// Invalid values fall back to undefined per field, so one bad param doesn't
// discard the others.
const queryNumber = (min: number, max: number) =>
  z
    .preprocess(
      (value) =>
        typeof value === 'string' && DECIMAL_NUMBER.test(value.trim())
          ? Number(value.trim())
          : undefined,
      z.number().min(min).max(max).optional(),
    )
    .catch(undefined);

const zoneMapQuerySchema = z.object({
  lat: queryNumber(-90, 90),
  lon: queryNumber(-180, 180),
  zoom: queryNumber(0, 22),
});

export function parseZoneMapQuery(query: ParsedUrlQuery): ZoneMapOptions {
  const { lat, lon, zoom } = zoneMapQuerySchema.parse(query);

  return {
    position: lat !== undefined && lon !== undefined ? { lat, lon } : null,
    zoom: zoom ?? DEFAULT_ZONE_MAP_ZOOM,
  };
}
