import { FromDepartureQuery } from './types';
import { searchTimeToQueryString } from '@atb/modules/search-time';
import { ParsedUrlQueryInput } from 'querystring';

export function createFromQuery(tripQuery: FromDepartureQuery): {
  pathname: string;
  query: ParsedUrlQueryInput;
} {
  const searchTimeQuery = searchTimeToQueryString(tripQuery.searchTime);

  if (tripQuery.from?.layer == 'venue') {
    return {
      pathname: '/departures/[[...id]]',
      query: {
        id: tripQuery.from.id,
        ...searchTimeQuery,
      },
    };
  }

  if (tripQuery.from) {
    const [lon, lat] = tripQuery.from.geometry.coordinates;
    return {
      pathname: '/departures',
      query: {
        ...searchTimeQuery,
        lon,
        lat,
      },
    };
  }

  return {
    pathname: '/departures',
    query: searchTimeQuery,
  };
}
