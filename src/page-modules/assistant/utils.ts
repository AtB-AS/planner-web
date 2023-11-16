import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  type TripData,
  type TripQuery,
  TripQuerySchema,
} from '@atb/page-modules/assistant';
import type { SearchMode, SearchTime } from '@atb/modules/search-time';
import {
  filterToQueryString,
  type TransportModeFilterState,
} from '@atb/modules/transport-mode';
import { searchTimeToQueryString } from '@atb/modules/search-time';

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

function featuresToFromToQuery(from: GeocoderFeature, to: GeocoderFeature) {
  return {
    fromId: from.id,
    fromLon: from.geometry.coordinates[0],
    fromLat: from.geometry.coordinates[1],
    fromLayer: from.layer,
    toId: to.id,
    toLon: to.geometry.coordinates[0],
    toLat: to.geometry.coordinates[1],
    toLayer: to.layer,
  };
}

export function createTripQuery(
  fromFeature: GeocoderFeature,
  toFeature: GeocoderFeature,
  searchTime: SearchTime,
  transportModeFilter?: TransportModeFilterState,
  cursor?: string,
): TripQuery {
  let transportModeFilterQuery = {};
  if (transportModeFilter) {
    const filterQueryString = filterToQueryString(transportModeFilter);
    if (filterQueryString) {
      transportModeFilterQuery = {
        filter: filterQueryString,
      };
    }
  }

  const searchTimeQuery = searchTimeToQueryString(searchTime);
  const cursorQuery = cursor ? { cursor } : {};
  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    ...transportModeFilterQuery,
    ...searchTimeQuery,
    ...cursorQuery,
    ...fromToQuery,
  };
}

export function parseTripQuery(query: any): TripQuery | undefined {
  const requiredNumericFields = ['fromLat', 'fromLon', 'toLat', 'toLon'];
  requiredNumericFields.forEach((field) => {
    if (typeof query[field] === 'string')
      query[field] = parseFloat(query[field]);
  });

  const optionalNumericFields = ['searchTime'];
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
