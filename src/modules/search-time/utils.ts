import { SearchMode, SearchTime } from './types';

export function parseSearchTimeQuery(
  searchModeQuery: string | string[] | undefined,
  searchTimeQuery: number | undefined,
): SearchTime {
  if (!searchModeQuery) return { mode: 'now' };

  if (searchModeQuery.toString() !== 'now') {
    if (searchTimeQuery === undefined) return { mode: 'now' };
    return {
      mode: searchModeQuery.toString() as SearchMode,
      dateTime: searchTimeQuery,
    };
  }

  // For 'now' mode, preserve dateTime if present so it survives the URL
  // roundtrip and continues to act as a cache-buster. The backend ignores
  // it and uses the server's current time when mode is 'now'.
  return searchTimeQuery !== undefined
    ? { mode: 'now', dateTime: searchTimeQuery }
    : { mode: 'now' };
}

export function searchTimeToQueryString(searchTime: SearchTime) {
  if (searchTime.mode !== 'now') {
    return { searchMode: searchTime.mode, searchTime: searchTime.dateTime };
  }
  return searchTime.dateTime !== undefined
    ? { searchMode: searchTime.mode, searchTime: searchTime.dateTime }
    : { searchMode: searchTime.mode };
}
