import {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import { TransportModeFilterState } from '@atb/components/transport-mode-filter/types';
import { filterToQueryString } from '@atb/components/transport-mode-filter/utils';
import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  TripQuery,
  TripQueryObject,
  TripQuerySchema,
} from '@atb/page-modules/assistant';

export const featuresToFromToQuery = (
  from: GeocoderFeature,
  to: GeocoderFeature,
) => {
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

export const createTripQueryObject = (
  fromFeature: GeocoderFeature,
  toFeature: GeocoderFeature,
  transportModeFilter?: TransportModeFilterState,
  departureDate?: DepartureDate,
): TripQueryObject => {
  const filter =
    transportModeFilter && filterToQueryString(transportModeFilter);
  const arriveBy = departureDate?.type === DepartureDateState.Arrival;
  const departBy = departureDate?.type === DepartureDateState.Departure;
  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    ...(filter ? { filter } : {}),
    ...(arriveBy ? { arriveBy: departureDate.dateTime } : {}),
    ...(departBy ? { departBy: departureDate.dateTime } : {}),
    ...fromToQuery,
  };
};

export const parseTripQuery = (query: any): TripQuery | undefined => {
  const parsed = TripQuerySchema.safeParse(query);
  if (!parsed.success) return undefined;
  return parsed.data;
};
