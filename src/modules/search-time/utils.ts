import { SearchMode, SearchTime } from './types';

export function parseSearchTimeQuery(
  searchModeQuery: SearchMode | undefined,
  searchTimeQuery: number | undefined,
): SearchTime {
  if (!searchTimeQuery) {
    return { mode: 'now' };
  }

  return {
    mode: searchModeQuery ?? 'now',
    dateTime: searchTimeQuery,
  };
}

export function searchTimeToQueryString(searchTime: SearchTime) {
  return searchTime.dateTime !== undefined
    ? { searchMode: searchTime.mode, searchTime: searchTime.dateTime }
    : { searchMode: searchTime.mode };
}
