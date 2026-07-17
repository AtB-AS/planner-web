import { getShouldShowLiveVehicle } from '@atb/page-modules/departures/details/utils';
import { useServiceJourneyVehicles } from '@atb/page-modules/departures/client/vehicles';
import { ExtendedLegType } from '@atb/page-modules/assistant';

/**
 * Returns the set of service journey ids among `legs` that currently have a
 * live vehicle position, used to gate the "follow vehicle" button. Only the
 * legs within the live-vehicle time window are queried, and only while
 * `enabled` (e.g. when the trip is expanded).
 */
export function useLiveVehicleServiceJourneyIds(
  legs: ExtendedLegType[],
  enabled: boolean = true,
): Set<string> {
  const candidateIds = legs
    .filter(
      (leg) =>
        leg.serviceJourney?.id &&
        getShouldShowLiveVehicle(leg.serviceJourneyEstimatedCalls),
    )
    .map((leg) => leg.serviceJourney!.id);

  const vehicles = useServiceJourneyVehicles(
    candidateIds,
    enabled && candidateIds.length > 0,
  );

  return new Set(
    vehicles.filter((v) => v.location).map((v) => v.serviceJourney.id),
  );
}
