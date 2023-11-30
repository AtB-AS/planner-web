import {
  TransportModeFilterState,
  filterToQueryString,
} from '@atb/modules/transport-mode';
import { FromDepartureQuery } from './types';
import { searchTimeToQueryString } from '@atb/modules/search-time';
import { Url } from 'url';
import { ParsedUrlQueryInput } from 'querystring';

export function createFromQuery(
  tripQuery: FromDepartureQuery,
  transportModeFilter: TransportModeFilterState,
): {
  pathname: string;
  query: ParsedUrlQueryInput;
} {
  let transportModeFilterQuery = {};
  if (transportModeFilter) {
    const filterQueryString = filterToQueryString(transportModeFilter);
    if (filterQueryString) {
      transportModeFilterQuery = {
        filter: filterQueryString,
      };
    }
  }

  const searchTimeQuery = searchTimeToQueryString(tripQuery.searchTime);

  if (tripQuery.from?.layer == 'venue') {
    return {
      pathname: '/departures/[[...id]]',
      query: {
        id: tripQuery.from.id,
        ...transportModeFilterQuery,
        ...searchTimeQuery,
      },
    };
  }

  if (tripQuery.from) {
    const [lon, lat] = tripQuery.from.geometry.coordinates;
    return {
      pathname: '/departures',
      query: {
        ...transportModeFilterQuery,
        ...searchTimeQuery,
        lon,
        lat,
      },
    };
  }

  return {
    pathname: '/departures',
    query: {
      ...transportModeFilterQuery,
      ...searchTimeQuery,
    },
  };
}
