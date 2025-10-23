import useSWRImmutable from 'swr/immutable';
import { swrPostFetcher } from '@atb/modules/api-browser';
import {
  ExtendedLegType,
  LegToGetPriceFromSchema,
  LegToGetPriceFrom,
  TripPatternPriceRequestBodySchema,
  TripPatternPrice,
} from '@atb/page-modules/assistant';
import { getOrgData } from '@atb/modules/org-data';
import { isDefined } from '@atb/utils/presence';

export function useTripPatternPrice(tripPatternPriceProps: {
  travelDate: Date;
  legs: ExtendedLegType[];
  isEnabled: boolean;
}) {
  const { featureConfig } = getOrgData();

  const { travelDate, legs, isEnabled } = tripPatternPriceProps;
  const legsToGetPriceFrom: LegToGetPriceFrom[] = legs
    .map(
      (leg) =>
        LegToGetPriceFromSchema.safeParse({
          fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
          toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
          serviceJourneyId: leg.serviceJourney?.id,
          mode: leg.mode,
          travelDate: leg.serviceDate,
        }).data,
    )
    .filter(isDefined);

  const requestBody = {
    travelDate: travelDate.toISOString(),
    legs: legsToGetPriceFrom,
  };

  return useSWRImmutable<TripPatternPrice>(
    isEnabled ? ['/api/assistant/trip-pattern-price', requestBody] : null,
    swrPostFetcher,
  );
}
