import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { TripQueryObject } from '@atb/page-modules/assistant/';

export type TripApiReturnType = TripData;

export async function nextTripPatterns(
  query: TripQueryObject,
  cursor: string,
): Promise<TripApiReturnType> {
  const queryString = Object.keys(query)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(String(query[key as keyof TripQueryObject])),
    )
    .join('&');

  const result = await fetch(
    `/api/assistant/trip?${queryString}&cursor=${cursor}`,
  );

  return await result.json();
}
