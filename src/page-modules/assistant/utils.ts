import {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import { TransportModeFilterState } from '@atb/components/transport-mode-filter/types';
import { filterToQueryString } from '@atb/components/transport-mode-filter/utils';
import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  DepartureMode,
  TripQuery,
  TripQuerySchema,
} from '@atb/page-modules/assistant';

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
  transportModeFilter?: TransportModeFilterState,
  departureDate?: DepartureDate,
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

  const departureMode =
    departureDate?.type === DepartureDateState.Arrival
      ? DepartureMode.ArriveBy
      : DepartureMode.DepartBy;

  const departureDateQuery =
    departureDate && departureDate.type !== DepartureDateState.Now
      ? { departureMode, departureDate: departureDate.dateTime }
      : {};

  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    ...transportModeFilterQuery,
    ...departureDateQuery,
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

export function departureModeToDepartureDate(
  mode?: DepartureMode,
  date?: number,
): DepartureDate {
  if (mode === 'arriveBy') {
    return { type: DepartureDateState.Arrival, dateTime: date ?? Date.now() };
  } else if (mode === 'departBy') {
    return { type: DepartureDateState.Departure, dateTime: date ?? Date.now() };
  } else {
    return { type: DepartureDateState.Now };
  }
}
