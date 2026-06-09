import { SearchMode, SearchTime } from './types';

export function parseSearchTimeQuery(
  mode: SearchMode | undefined,
  searchTimeQuery: number | undefined,
): SearchTime {
  if (!mode || mode === 'now') {
    return { mode: 'now', dateTime: searchTimeQuery };
  }
  if (searchTimeQuery === undefined) {
    return { mode: 'now' };
  }
  return { mode, dateTime: searchTimeQuery };
}

export function searchTimeToQueryString(searchTime: SearchTime) {
  return searchTime.dateTime !== undefined
    ? { searchMode: searchTime.mode, searchTime: searchTime.dateTime }
    : { searchMode: searchTime.mode };
}
