import { SearchMode, SearchTime } from './types';

export function parseSearchTimeQuery(
  searchModeQuery: SearchMode | undefined,
  searchTimeQuery: number | undefined,
): SearchTime {
  if (!searchModeQuery || searchModeQuery === 'now') {
    return { mode: 'now', dateTime: searchTimeQuery };
  }
  if (searchTimeQuery === undefined) {
    return { mode: 'now' };
  }
  return { mode: searchModeQuery, dateTime: searchTimeQuery };
}

export function searchTimeToQueryString(searchTime: SearchTime) {
  return searchTime.dateTime !== undefined
    ? { searchMode: searchTime.mode, searchTime: searchTime.dateTime }
    : { searchMode: searchTime.mode };
}
