import { NonTransitTripData, TripQuery, TripData } from '../../types';

export type TripApiReturnType = TripData;

export async function getTripPatterns(
  query: TripQuery,
): Promise<TripApiReturnType> {
  const queryString = tripQueryToQueryString(query);

  const result = await fetch(`/api/assistant/trip?${queryString}`);

  return await result.json();
}

function tripQueryToQueryString(input: TripQuery): string {
  return Object.keys(input)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(String(input[key as keyof TripQuery])),
    )
    .join('&');
}

export type NonTransitTripApiReturnType = NonTransitTripData;
export async function getNonTransitTrip(
  query: TripQuery,
): Promise<NonTransitTripApiReturnType> {
  const queryString = tripQueryToQueryString(query);
  const result = await fetch(`/api/assistant/non-transit-trip?${queryString}`);
  return await result.json();
}
