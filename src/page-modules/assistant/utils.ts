import {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import { TransportModeFilterState } from '@atb/components/transport-mode-filter/types';
import { filterToQueryString } from '@atb/components/transport-mode-filter/utils';
import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  DepartureMode,
  TripData,
  TripQuery,
  TripQuerySchema,
} from '@atb/page-modules/assistant';

export function filterOutDuplicates(
  arrayToFilter: TripData['tripPatterns'],
  referenceArray: TripData['tripPatterns'],
): TripData['tripPatterns'] {
  const existing = new Set<string>(
    referenceArray.map((tp) => tp.expectedStartTime),
  );
  return arrayToFilter.filter((tp) => !existing.has(tp.expectedStartTime));
}

export function getCursorByDepartureMode(
  trip: TripData,
  departureMode: DepartureMode,
) {
  if (departureMode === DepartureMode.ArriveBy) {
    return trip.previousPageCursor;
  } else {
    return trip.nextPageCursor;
  }
}

const featuresToFromToQuery = (from: GeocoderFeature, to: GeocoderFeature) => {
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
};

export const createTripQuery = (
  fromFeature: GeocoderFeature,
  toFeature: GeocoderFeature,
  departureMode: DepartureMode,
  departureDate?: number,
  transportModeFilter?: TransportModeFilterState,
  cursor?: string,
): TripQuery => {
  let transportModeFilterQuery = {};
  if (transportModeFilter) {
    const filterQueryString = filterToQueryString(transportModeFilter);
    if (filterQueryString) {
      transportModeFilterQuery = {
        filter: filterQueryString,
      };
    }
  }

  const departureDateQuery = departureDate
    ? { departureMode, departureDate }
    : { departureMode };
  const cursorQuery = cursor ? { cursor } : {};
  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    ...transportModeFilterQuery,
    ...departureDateQuery,
    ...cursorQuery,
    ...fromToQuery,
  };
};

export const parseTripQuery = (query: any): TripQuery | undefined => {
  const requiredNumericFields = ['fromLat', 'fromLon', 'toLat', 'toLon'];
  requiredNumericFields.forEach((field) => {
    if (typeof query[field] === 'string')
      query[field] = parseFloat(query[field]);
  });

  const optionalNumericFields = ['departureDate'];
  optionalNumericFields.forEach((field) => {
    if (query[field] && typeof query[field] === 'string')
      query[field] = Number(query[field]);
  });

  const parsed = TripQuerySchema.safeParse(query);
  if (!parsed.success) {
    return undefined;
  }
  return parsed.data;
};

export function departureDateToDepartureMode(
  departureDate: DepartureDate,
): DepartureMode {
  if (departureDate.type === 'arrival') return DepartureMode.ArriveBy;
  return DepartureMode.DepartBy;
}

export function departureModeToDepartureDate(
  mode?: DepartureMode,
  date?: number | null,
): DepartureDate {
  if (mode === 'arriveBy') {
    return { type: DepartureDateState.Arrival, dateTime: date ?? Date.now() };
  } else if (mode === 'departBy' && !date) {
    return { type: DepartureDateState.Now };
  } else if (mode === 'departBy') {
    return { type: DepartureDateState.Departure, dateTime: date ?? Date.now() };
  } else {
    return { type: DepartureDateState.Now };
  }
}
