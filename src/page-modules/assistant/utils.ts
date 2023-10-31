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
import { Quay, TripPattern } from './server/journey-planner/validators';

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
      ? { departureDate: departureDate.dateTime }
      : {};

  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    departureMode,
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

export function getStartModeAndPlace(tripPattern: TripPattern) {
  let startLeg = tripPattern.legs[0];
  let startName = startLeg.fromPlace.name;

  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    startLeg = tripPattern.legs[1];
    startName = getQuayName(startLeg.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    startName = getQuayName(startLeg.fromPlace.quay);
  }

  return {
    startMode: startLeg.mode ?? 'unknown',
    startPlace: startName ?? '',
  };
}

export function getQuayName(quay: Quay | null): string | null {
  if (!quay) return null;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
