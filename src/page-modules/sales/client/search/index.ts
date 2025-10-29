import useSWRImmutable from 'swr/immutable';
import { swrPostFetcher } from '@atb/modules/api-browser';
import {
  ExtendedLegType,
  LegToGetPriceFromSchema,
  LegToGetPriceFrom,
  TripPatternPrice,
} from '@atb/page-modules/assistant';
import { isDefined } from '@atb/utils/presence';

export function useTripPatternPrice(
  travelDate: Date,
  legs: ExtendedLegType[],
  shouldFetch: boolean,
) {
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
    shouldFetch ? ['/api/assistant/trip-pattern-price', requestBody] : null,
    swrPostFetcher,
    {
      shouldRetryOnError(err) {
        return err.status !== 404;
      },
    },
  );
}
