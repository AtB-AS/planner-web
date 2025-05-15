import { parseSearchTimeQuery } from '@atb/modules/search-time';
import { parseFilterQuery } from '@atb/modules/transport-mode';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { ParsedUrlQuery } from 'querystring';
import { TripQuery } from '.';
import { AssistantClient } from './server';
import { FromToTripQuery } from './types';
import { parseTripQuery } from './utils';

export async function fetchFromToTripQuery(
  query: ParsedUrlQuery,
  client: AssistantClient,
): Promise<FromToTripQuery> {
  const tripQuery = parseTripQuery(query);

  if (!tripQuery) {
    return {
      from: null,
      to: null,
      via: null,
      transportModeFilter: [],
      searchTime: { mode: 'now' },
      cursor: null,
      lineFilter: [],
    };
  }

  const transportModeFilter = parseFilterQuery(tripQuery.filter);
  const lineFilter = parseFilterQuery(tripQuery.lineFilter);
  const searchTime = parseSearchTimeQuery(
    tripQuery.searchMode,
    tripQuery.searchTime,
  );

  const [from, to, via] = await Promise.all([
    getFromPromise(tripQuery, client),
    getToPromise(tripQuery, client),
    getViaPromise(tripQuery, client),
  ]);

  return {
    from,
    to,
    via,
    transportModeFilter,
    searchTime,
    cursor: tripQuery?.cursor ?? null,
    lineFilter,
  };
}

type LocationType = 'from' | 'to' | 'via';
/**
 * Generic function to retrieve a GeocoderFeature for a location in a trip
 * query.
 *
 * @param tripQuery - The trip query containing location information
 * @param client - The AssistantClient used to make autocomplete requests
 * @param locationType - The type of location ('from', 'to', or 'via')
 * @returns A Promise that resolves to the matching GeocoderFeature, or null if
 * none found
 */
async function getLocationPromise(
  tripQuery: TripQuery,
  client: AssistantClient,
  locationType: LocationType,
): Promise<GeocoderFeature | null> {
  // If no name exists for this location type, we can't search
  if (!hasName(tripQuery, locationType)) {
    return null;
  }

  const nameKey = `${locationType}Name` as const;
  const result = await client.autocomplete(tripQuery[nameKey]);

  // If no results were found, return null early
  if (result.length === 0) {
    return null;
  }

  let feature: GeocoderFeature | undefined;

  // First, try to find feature based on ID if available
  if (hasId(tripQuery, locationType)) {
    const idKey = `${locationType}Id` as const;
    feature = result.find((feature) => feature.id === tripQuery[idKey]);
    if (feature) return feature;
  }

  // If no match by ID, try to find by coordinates
  if (hasCoordinates(tripQuery, locationType)) {
    const latKey = `${locationType}Lat` as const;
    const lonKey = `${locationType}Lon` as const;

    const lat = tripQuery[latKey];
    const lon = tripQuery[lonKey];

    // Find the feature with the exact coordinates, or the closest one
    // if no exact match is found.
    feature =
      result.find(
        (feature) =>
          feature.geometry.coordinates[0] === lon &&
          feature.geometry.coordinates[1] === lat,
      ) ?? findClosestFeatureByCoordinates(result, lon, lat);

    if (feature) return feature;
  }

  // If no match by ID or coordinates, use the first result
  return result[0];
}

async function getFromPromise(
  tripQuery: TripQuery,
  client: AssistantClient,
): Promise<GeocoderFeature | null> {
  return getLocationPromise(tripQuery, client, 'from');
}

async function getToPromise(
  tripQuery: TripQuery,
  client: AssistantClient,
): Promise<GeocoderFeature | null> {
  return getLocationPromise(tripQuery, client, 'to');
}

async function getViaPromise(
  tripQuery: TripQuery,
  client: AssistantClient,
): Promise<GeocoderFeature | null> {
  return getLocationPromise(tripQuery, client, 'via');
}

/**
 * The functions below are type guards to check if the query has the needed
 * properties.
 */

function hasName(
  query: TripQuery,
  locationType: LocationType,
): query is Required<Pick<TripQuery, `${LocationType}Name`>> {
  const key = `${locationType}Name` as const;
  return query[key] !== undefined;
}

function hasId(
  query: TripQuery,
  locationType: LocationType,
): query is Required<Pick<TripQuery, `${LocationType}Id`>> {
  const key = `${locationType}Id` as const;
  return query[key] !== undefined;
}

function hasCoordinates(
  query: TripQuery,
  locationType: LocationType,
): query is Required<
  Pick<TripQuery, `${LocationType}Lat` | `${LocationType}Lon`>
> {
  const latKey = `${locationType}Lat` as const;
  const lonKey = `${locationType}Lon` as const;
  return query[latKey] !== undefined && query?.[lonKey] !== undefined;
}

/**
 * Finds the closest GeocoderFeature to the given coordinates based on a simple
 * distance calculation.
 *
 * @param result - An array of GeocoderFeature objects to search through
 * @param lon - Longitude coordinate to compare against
 * @param lat - Latitude coordinate to compare against
 * @returns The GeocoderFeature closest to the given coordinates, or undefined
 * if the array is empty
 */
function findClosestFeatureByCoordinates(
  result: GeocoderFeature[],
  lon: number,
  lat: number,
): GeocoderFeature | undefined {
  return result.reduce((prev, curr) => {
    const prevDistance = getDistance(
      prev.geometry.coordinates[0],
      prev.geometry.coordinates[1],
      lon,
      lat,
    );
    const currDistance = getDistance(
      curr.geometry.coordinates[0],
      curr.geometry.coordinates[1],
      lon,
      lat,
    );
    return currDistance < prevDistance ? curr : prev;
  });
}

/**
 * Calculate the Euclidean distance between two points
 *
 * @param lon1 - Longitude of the first point
 * @param lat1 - Latitude of the first point
 * @param lon2 - Longitude of the second point
 * @param lat2 - Latitude of the second point
 * @returns The distance between the points
 */
function getDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
): number {
  // Using the Pythagorean theorem for simplicity
  // For more accurate geographic distance, consider using the Haversine formula
  const dx = lon2 - lon1;
  const dy = lat2 - lat1;
  return Math.sqrt(dx * dx + dy * dy);
}
