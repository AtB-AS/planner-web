import { searchTimeToQueryString } from '@atb/modules/search-time';
import { GeocoderFeature } from '@atb/modules/geocoder';
import { FromToTripQuery, TripQuery, TripQuerySchema } from './types';
import { TravelSearchFiltersType } from '@atb-as/config-specs';
import { filterNotices } from '@atb/modules/situations';
import { LegWithDetailsFragment } from './journey-gql/trip-with-details.generated';

function featuresToFromToQuery(
  from: GeocoderFeature | null,
  to: GeocoderFeature | null,
  via: GeocoderFeature | null,
) {
  let ret = {};
  if (from) {
    ret = {
      fromId: from.id,
      fromName: from.name,
      fromLon: from.geometry.coordinates[0],
      fromLat: from.geometry.coordinates[1],
      fromLayer: from.layer,
    };
  }

  if (to) {
    ret = {
      ...ret,
      toId: to.id,
      toName: to.name,
      toLon: to.geometry.coordinates[0],
      toLat: to.geometry.coordinates[1],
      toLayer: to.layer,
    };
  }

  if (via) {
    ret = {
      ...ret,
      viaId: via.id,
      viaName: via.name,
      viaLon: via.geometry.coordinates[0],
      viaLat: via.geometry.coordinates[1],
      viaLayer: via.layer,
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
  const fromToQuery = featuresToFromToQuery(
    tripQuery.from,
    tripQuery.to,
    tripQuery.via ? tripQuery.via : null,
  );

  let lineFilterQuery = {};
  if (tripQuery.lineFilter && tripQuery.lineFilter.length) {
    lineFilterQuery = {
      lineFilter: tripQuery.lineFilter.join(','),
    };
  }

  return {
    ...transportModeFilterQuery,
    ...searchTimeQuery,
    ...cursorQuery,
    ...fromToQuery,
    ...lineFilterQuery,
  };
}

export function parseTripQuery(query: any): TripQuery | undefined {
  const optionalNumericFields = [
    'fromLat',
    'fromLon',
    'toLat',
    'toLon',
    'viaLat',
    'viaLon',
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

export function setTransportModeFilters(
  transportModes: TravelSearchFiltersType['transportModes'],
) {
  return (
    transportModes
      ?.filter((filter) => filter.selectedAsDefault)
      .map((filter) => filter.id) ?? null
  );
}

export const getNoticesForLeg = (leg: LegWithDetailsFragment) =>
  filterNotices([
    ...(leg.line?.notices || []),
    ...(leg.serviceJourney?.notices || []),
    ...(leg.serviceJourney?.journeyPattern?.notices || []),
    ...(leg.fromEstimatedCall?.notices || []),
    ...(leg.toEstimatedCall?.notices || []),
  ]);
