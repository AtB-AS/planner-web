import { parseTripQueryString } from '../server/journey-planner';

export function formatQuayName(quayName?: string, publicCode?: string | null) {
  if (!quayName) return;
  if (!publicCode) return quayName;
  return `${quayName} ${publicCode}`;
}

export function getPlaceName(
  placeName?: string,
  quayName?: string,
  publicCode?: string | null,
): string {
  const fallback = placeName ?? '';
  return quayName ? formatQuayName(quayName, publicCode) ?? fallback : fallback;
}

export function formatLineName(
  frontText?: string,
  lineName?: string,
  publicCode?: string | null,
): string {
  const name = frontText ?? lineName ?? '';
  return publicCode ? `${publicCode} ${name}` : name;
}

export function tripQueryStringToQueryParams(
  queryString: string,
): URLSearchParams | undefined {
  const tripQueryVariables = parseTripQueryString(queryString);
  if (!tripQueryVariables) return undefined;

  const { arriveBy, from, to } = tripQueryVariables.query;
  const originalSearchTime = tripQueryVariables.originalSearchTime;
  if (
    !from ||
    !to ||
    !from.coordinates ||
    !to.coordinates ||
    !from.place ||
    !to.place ||
    !originalSearchTime
  )
    return undefined;

  const searchMode = arriveBy ? 'arriveBy' : 'departBy';
  const fromLayer = from.place?.includes('StopPlace') ? 'venue' : 'address';
  const toLayer = to.place?.includes('StopPlace') ? 'venue' : 'address';
  const searchTime = String(new Date(originalSearchTime).getTime());

  const params = {
    searchMode,
    searchTime,
    fromId: from.place,
    fromLon: String(from.coordinates.longitude),
    fromLat: String(from.coordinates.latitude),
    fromLayer,
    toId: to.place,
    toLon: String(to.coordinates.longitude),
    toLat: String(to.coordinates.latitude),
    toLayer,
  };

  return new URLSearchParams(params);
}
