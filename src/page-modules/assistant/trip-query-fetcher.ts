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
  if (hasName(tripQuery, locationType)) {
    const nameKey = `${locationType}Name` as const;
    const result = await client.autocomplete(tripQuery[nameKey]);

    let feature: GeocoderFeature | undefined;

    if (hasId(tripQuery, locationType)) {
      const idKey = `${locationType}Id` as const;
      feature = result.find((feature) => feature.id === tripQuery[idKey]);
    } else if (hasCoordinates(tripQuery, locationType)) {
      const latKey = `${locationType}Lat` as const;
      const lonKey = `${locationType}Lon` as const;
      feature = result.find(
        (feature) =>
          feature.geometry.coordinates[0] === tripQuery[lonKey] &&
          feature.geometry.coordinates[1] === tripQuery[latKey],
      );
    } else if (result.length > 0) {
      feature = result[0];
    }

    return feature || null;
  }

  return Promise.resolve(null);
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
