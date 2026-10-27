import { defaultPosition, type PositionType } from '@atb/components/map';
import type { ParsedUrlQuery } from 'querystring';
import z from 'zod';

// Zoomed out enough to show several fare zones at once.
export const DEFAULT_ZONE_MAP_ZOOM = 9;

export type ZoneMapOptions = {
  position: PositionType;
  zoom: number;
};

// Invalid values fall back to undefined per field, so one bad param doesn't
// discard the others. Empty strings are treated as missing instead of 0.
const queryNumber = (min: number, max: number) =>
  z
    .preprocess(
      (value) => (value === '' ? undefined : value),
      z.coerce.number().min(min).max(max).optional(),
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
    position:
      lat !== undefined && lon !== undefined ? { lat, lon } : defaultPosition,
    zoom: zoom ?? DEFAULT_ZONE_MAP_ZOOM,
  };
}
