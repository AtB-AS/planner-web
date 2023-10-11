import { EstimatedCallsData } from '@atb/page-modules/departures/server/journey-planner/validators';

export type EstimatedCallsApiReturnType = EstimatedCallsData;
export async function nextDepartures(
  quayId: string,
  startTime: string,
): Promise<EstimatedCallsApiReturnType> {
  const result = await fetch(
    `/api/departures/journey-planner?quayId=${quayId}&startTime=${startTime}`,
  );

  return await result.json();
}
