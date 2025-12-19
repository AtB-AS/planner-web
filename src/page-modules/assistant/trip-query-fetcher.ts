import { parseSearchTimeQuery } from '@atb/modules/search-time';
import { parseFilterQuery } from '@atb/modules/transport-mode';
import { GeocoderFeature } from '@atb/modules/geocoder';
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
      walkSpeed: null,
      transferSlack: null,
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
    walkSpeed: tripQuery.walkSpeed !== undefined ? tripQuery.walkSpeed : null,
    transferSlack:
      tripQuery.transferSlack !== undefined ? tripQuery.transferSlack : null,
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
  // If the properties do not exist for this location type, we can't search.
  if (!hasProperties(tripQuery, locationType)) {
    return null;
  }

  const { name, id, lat, lon } = getProperties(tripQuery, locationType);

  const result = await client.autocomplete(name, {
    lat,
    lon,
  });

  // If no results were found, return null early
  if (result.length === 0) {
    return null;
  }

  // First, try to find feature based on ID if available
  let feature = result.find((feature) => feature.id === id);
  if (feature) return feature;

  // If no match by ID, try to find by coordinates.
  // Find the feature with the exact coordinates, or the closest one
  // if no exact match is found.
  feature =
    result.find(
      (feature) =>
        feature.geometry.coordinates[0] === lon &&
        feature.geometry.coordinates[1] === lat,
    ) ?? findClosestFeatureByCoordinates(result, lon, lat);

  if (feature) return feature;

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

function hasProperties(
  query: TripQuery,
  locationType: LocationType,
): query is Required<
  Pick<
    TripQuery,
    | `${LocationType}Name`
    | `${LocationType}Id`
    | `${LocationType}Lat`
    | `${LocationType}Lon`
  >
> {
  const nameKey = `${locationType}Name` as const;
  const idKey = `${locationType}Id` as const;
  const latKey = `${locationType}Lat` as const;
  const lonKey = `${locationType}Lon` as const;
  return (
    query[nameKey] !== undefined ||
    query[idKey] !== undefined ||
    (query[latKey] !== undefined && query[lonKey] !== undefined)
  );
}

/**
 * Extracts location properties from a trip query.
 *
 * @param query - Trip query object containing location-specific properties.
 * @param locationType - Type of the location ('from', 'to', etc.).
 * @returns An object containing name, id, latitude, and longitude properties.
 */
function getProperties(
  query: Required<
    Pick<
      TripQuery,
      | `${LocationType}Name`
      | `${LocationType}Id`
      | `${LocationType}Lat`
      | `${LocationType}Lon`
    >
  >,
  locationType: LocationType,
) {
  const nameKey = `${locationType}Name` as const;
  const idKey = `${locationType}Id` as const;
  const latKey = `${locationType}Lat` as const;
  const lonKey = `${locationType}Lon` as const;

  return {
    name: query[nameKey],
    id: query[idKey],
    lat: query[latKey],
    lon: query[lonKey],
  };
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
