import { TripData } from '../../server/journey-planner/validators';
import { TripQuery } from '../../types';

export type TripApiReturnType = TripData;

export async function nextTripPatterns(
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
