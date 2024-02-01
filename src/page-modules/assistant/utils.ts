import type { SearchMode } from '@atb/modules/search-time';
import { searchTimeToQueryString } from '@atb/modules/search-time';
import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  FromToTripQuery,
  TripData,
  TripInput,
  TripQuery,
  TripQuerySchema,
} from './types';

export function filterOutDuplicates(
  arrayToFilter: TripData['tripPatterns'],
  referenceArray: TripData['tripPatterns'],
): TripData['tripPatterns'] {
  const existing = new Set<string>(
    referenceArray.map((tp) => tp.expectedStartTime),
  );
  return arrayToFilter.filter((tp) => !existing.has(tp.expectedStartTime));
}

export function getCursorBySearchMode(trip: TripData, searchMode: SearchMode) {
  if (searchMode === 'arriveBy') {
    return trip.previousPageCursor;
  } else {
    return trip.nextPageCursor;
  }
}

function featuresToFromToQuery(
  from: GeocoderFeature | null,
  to: GeocoderFeature | null,
) {
  let ret = {};
  if (from) {
    ret = {
      fromId: from.id,
      fromLon: from.geometry.coordinates[0],
      fromLat: from.geometry.coordinates[1],
      fromLayer: from.layer,
    };
  }

  if (to) {
    ret = {
      ...ret,
      toId: to.id,
      toLon: to.geometry.coordinates[0],
      toLat: to.geometry.coordinates[1],
      toLayer: to.layer,
    };
  }
  return ret;
}

export function createTripQuery(tripQuery: FromToTripQuery): TripQuery {
  let transportModeFilterQuery = {};
  if (tripQuery.transportModeFilter && tripQuery.transportModeFilter.length) {
    transportModeFilterQuery = {
      filter: tripQuery.transportModeFilter.join(','),
    };
  }

  const searchTimeQuery = searchTimeToQueryString(tripQuery.searchTime);
  const cursorQuery = tripQuery.cursor ? { cursor: tripQuery.cursor } : {};
  const fromToQuery = featuresToFromToQuery(tripQuery.from, tripQuery.to);

  return {
    ...transportModeFilterQuery,
    ...searchTimeQuery,
    ...cursorQuery,
    ...fromToQuery,
  };
}

export function parseTripQuery(query: any): TripQuery | undefined {
  const optionalNumericFields = [
    'fromLat',
    'fromLon',
    'toLat',
    'toLon',
    'searchTime',
  ];
  optionalNumericFields.forEach((field) => {
    if (query[field] && typeof query[field] === 'string')
      query[field] = Number(query[field]);
  });

  const parsed = TripQuerySchema.safeParse(query);
  if (!parsed.success) {
    return undefined;
  }
  return parsed.data;
}

export function tripQueryToQueryString(input: TripQuery): string {
  return Object.keys(input)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(String(input[key as keyof TripQuery])),
    )
    .join('&');
}
