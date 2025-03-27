import { EstimatedCallFragment } from '@atb/page-modules/departures/server/journey-planner/journey-gql/estimated-calls.generated.ts';

export type EstimatedCallsApiReturnType = EstimatedCallFragment[];
export async function nextDepartures(
  quayId: string,
  startTime: string,
): Promise<EstimatedCallsApiReturnType> {
  const result = await fetch(
    `/api/departures/journey-planner?quayId=${quayId}&startTime=${startTime}`,
  );

  return await result.json();
}
