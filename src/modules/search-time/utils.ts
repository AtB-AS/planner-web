import { SearchMode, SearchTime } from './types';

export function parseSearchTimeQuery(
  searchModeQuery: string | string[] | undefined,
  searchTimeQuery: number | undefined,
): SearchTime {
  if (searchTimeQuery === undefined || !searchModeQuery) return { mode: 'now' };

  if (searchModeQuery.toString() !== 'now') {
    return {
      mode: searchModeQuery.toString() as SearchMode,
      dateTime: searchTimeQuery,
    };
  }

  return { mode: 'now' };
}

export function searchTimeToQueryString(searchTime: SearchTime) {
  return searchTime.mode !== 'now'
    ? { searchMode: searchTime.mode, searchTime: searchTime.dateTime }
    : { searchMode: searchTime.mode };
}
