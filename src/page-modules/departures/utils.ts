import { FromDepartureQuery } from './types';
import { searchTimeToQueryString } from '@atb/modules/search-time';
import { TranslateFunction } from '@atb/translations';
import { ParsedUrlQueryInput } from 'querystring';
import { Departure } from './server/journey-planner';
import dictionary from '@atb/translations/dictionary';

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

export function formatDestinationDisplay(
  t: TranslateFunction,
  destinationDisplay: Departure['destinationDisplay'],
): string | undefined {
  const frontText = destinationDisplay.frontText;
  const via = destinationDisplay.via;

  if (via.length < 1) {
    return frontText;
  }

  let viaNames = via[0];
  if (via.length > 1) {
    viaNames =
      via.slice(0, -1).join(', ') +
      ` ${t(dictionary.listConcatWord)} ` +
      via[via.length - 1];
  }

  return frontText + ` ${t(dictionary.via)} ` + viaNames;
}
