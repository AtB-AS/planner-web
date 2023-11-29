import { SearchTime, parseSearchTimeQuery } from '@atb/modules/search-time';
import {
  TransportModeFilterOption,
  parseFilterQuery,
} from '@atb/modules/transport-mode';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { ParsedUrlQuery } from 'querystring';
import { TripQuery } from '.';
import { AssistantClient } from './server';
import { parseTripQuery } from './utils';

export type FromToTripQuery = {
  from: GeocoderFeature | null;
  to: GeocoderFeature | null;
  transportModeFilter: TransportModeFilterOption[] | null;
  searchTime: SearchTime;
  cursor: string | null;
};
export async function fetchFromToTripQuery(
  query: ParsedUrlQuery,
  client: AssistantClient,
): Promise<FromToTripQuery> {
  const tripQuery = parseTripQuery(query);
  const cursor = tripQuery?.cursor;
  const transportModeFilter = parseFilterQuery(tripQuery?.filter);
  const searchTime = parseSearchTimeQuery(
    tripQuery?.searchMode,
    tripQuery?.searchTime,
  );

  let fromP: Promise<GeocoderFeature | undefined> | undefined = undefined;
  let toP: Promise<GeocoderFeature | undefined> | undefined = undefined;

  if (!fromP && hasFromLatLon(tripQuery)) {
    fromP = client.reverse(
      tripQuery.fromLat,
      tripQuery.fromLon,
      tripQuery.fromLayer,
    );
  }

  if (hasToLatLon(tripQuery)) {
    toP = client.reverse(tripQuery.toLat, tripQuery.toLon, tripQuery.toLayer);
  }

  const [from, to] = await Promise.all([fromP, toP]);

  return {
    from: from ?? null,
    to: to ?? null,
    transportModeFilter,
    searchTime,
    cursor: cursor ?? null,
  };
}

function hasFromLatLon(
  query: TripQuery | undefined,
): query is Required<Pick<TripQuery, 'fromLat' | 'fromLayer' | 'fromLon'>> {
  return (
    query?.fromLon !== undefined &&
    query?.fromLat !== undefined &&
    query?.fromLayer !== undefined
  );
}
function hasToLatLon(
  query: TripQuery | undefined,
): query is Required<Pick<TripQuery, 'toLat' | 'toLayer' | 'toLon'>> {
  return (
    query?.toLon !== undefined &&
    query?.toLat !== undefined &&
    query?.toLayer !== undefined
  );
}
