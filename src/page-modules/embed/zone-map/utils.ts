import type { PositionType } from '@atb/components/map';
import type { ParsedUrlQuery } from 'node:querystring';

const DEFAULT_POSITION_ZOOM = 12;

export type ZoneMapQuery = {
  // When not set, the map fits to all fare zones.
  initialView?: { position: PositionType; zoom: number };
};

export function parseZoneMapQuery(query: ParsedUrlQuery): ZoneMapQuery {
  const lat = parseNumber(query.lat);
  const lon = parseNumber(query.lon);
  const zoom = parseNumber(query.zoom);

  const initialView =
    lat !== undefined && lon !== undefined
      ? { position: { lat, lon }, zoom: zoom ?? DEFAULT_POSITION_ZOOM }
      : undefined;

  return initialView ? { initialView } : {};
}

function parseNumber(value: ParsedUrlQuery[string]): number | undefined {
  const str = firstValue(value);
  if (!str) return undefined;
  const num = Number(str);
  return Number.isFinite(num) ? num : undefined;
}

function firstValue(value: ParsedUrlQuery[string]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
