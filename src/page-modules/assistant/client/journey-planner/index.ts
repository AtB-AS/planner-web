import { TripData } from '@atb/page-modules/assistant/server/journey-planner/validators';
import { TripQuery } from '@atb/page-modules/assistant/';

export type TripApiReturnType = TripData;

export async function nextTripPatterns(
  query: TripQuery,
  cursor: string,
): Promise<TripApiReturnType> {
  const queryString = new URLSearchParams(query).toString();

  const result = await fetch(
    `/api/assistant/trip?${queryString}&cursor=${cursor}`,
  );

  return await result.json();
}
