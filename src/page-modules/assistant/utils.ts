import {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import { TransportModeFilterState } from '@atb/components/transport-mode-filter/types';
import { filterToQueryString } from '@atb/components/transport-mode-filter/utils';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { TripQuery, TripQuerySchema } from '@atb/page-modules/assistant';

export const featuresToFromToQuery = (
  from: GeocoderFeature,
  to: GeocoderFeature,
) => {
  return {
    fromId: from.id,
    fromLon: from.geometry.coordinates[0].toString(),
    fromLat: from.geometry.coordinates[1].toString(),
    fromLayer: from.layer,
    toId: to.id,
    toLon: to.geometry.coordinates[0].toString(),
    toLat: to.geometry.coordinates[1].toString(),
    toLayer: to.layer,
  };
};

export const createTripQuery = (
  fromFeature: GeocoderFeature,
  toFeature: GeocoderFeature,
  transportModeFilter?: TransportModeFilterState,
  departureDate?: DepartureDate,
): TripQuery => {
  const filter =
    transportModeFilter && filterToQueryString(transportModeFilter);
  const arriveBy = departureDate?.type === DepartureDateState.Arrival;
  const departBy = departureDate?.type === DepartureDateState.Departure;
  const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

  return {
    ...(filter ? { filter } : {}),
    ...(arriveBy ? { arriveBy: departureDate.dateTime.toString() } : {}),
    ...(departBy ? { departBy: departureDate.dateTime.toString() } : {}),
    ...fromToQuery,
  };
};

export const parseTripQuery = (query: any): TripQuery | undefined => {
  const parsed = TripQuerySchema.safeParse(query);
  if (!parsed.success) return undefined;
  return parsed.data;
};
