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
  const cursor = tripQuery?.cursor;
  const transportModeFilter = parseFilterQuery(tripQuery?.filter);
  const lineFilter = parseFilterQuery(tripQuery?.lineFilter);
  const searchTime = parseSearchTimeQuery(
    tripQuery?.searchMode,
    tripQuery?.searchTime,
  );

  let fromP: Promise<GeocoderFeature | undefined> | undefined = undefined;
  let toP: Promise<GeocoderFeature | undefined> | undefined = undefined;
  let viaP: Promise<GeocoderFeature | undefined> | undefined = undefined;

  if (!fromP && hasFromLatLon(tripQuery)) {
    fromP = client
      .autocomplete(tripQuery.fromName, {
        lat: tripQuery.fromLat,
        lon: tripQuery.fromLon,
      })
      .then((result) => result[0]);
  }

  if (hasToLatLon(tripQuery)) {
    toP = client
      .autocomplete(tripQuery.toName, {
        lat: tripQuery.toLat,
        lon: tripQuery.toLon,
      })
      .then((result) => result[0]);
  }

  if (hasVia(tripQuery)) {
    viaP = client
      .autocomplete(tripQuery.viaName, {
        lat: tripQuery.viaLat,
        lon: tripQuery.viaLon,
      })
      .then((result) => result[0]);
  }

  const [from, to, via] = await Promise.all([fromP, toP, viaP]);

  return {
    from: from ?? null,
    to: to ?? null,
    via: via ?? null,
    transportModeFilter,
    searchTime,
    cursor: cursor ?? null,
    lineFilter,
  };
}

function hasFromLatLon(
  query: TripQuery | undefined,
): query is Required<
  Pick<TripQuery, 'fromLat' | 'fromLayer' | 'fromLon' | 'fromName'>
> {
  return (
    query?.fromName !== undefined &&
    query?.fromLon !== undefined &&
    query?.fromLat !== undefined &&
    query?.fromLayer !== undefined
  );
}
function hasToLatLon(
  query: TripQuery | undefined,
): query is Required<
  Pick<TripQuery, 'toLat' | 'toLayer' | 'toLon' | 'toName'>
> {
  return (
    query?.toName !== undefined &&
    query?.toLon !== undefined &&
    query?.toLat !== undefined &&
    query?.toLayer !== undefined
  );
}

function hasVia(
  query: TripQuery | undefined,
): query is Required<
  Pick<TripQuery, 'viaLat' | 'viaLayer' | 'viaLon' | 'viaName'>
> {
  return (
    query?.viaName !== undefined &&
    query?.viaLon !== undefined &&
    query?.viaLat !== undefined &&
    query?.viaLayer !== undefined
  );
}
