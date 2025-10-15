import useSWRImmutable from 'swr/immutable';
import { swrPostFetcher } from '@atb/modules/api-browser';
import {
  ExtendedLegType,
  LegToGetPriceFromSchema,
  LegToGetPriceFrom,
  Traveller,
  TripPatternPriceRequestBodySchema,
  TripPatternPriceResponse,
} from '@atb/page-modules/assistant';
import { getOrgData } from '@atb/modules/org-data';
import { isDefined } from '@atb/utils/presence';

export function useTripPatternPrice(tripPatternPriceProps: {
  travelDate: Date;
  legs: ExtendedLegType[];
  travellers: Traveller[];
  products: string[];
}) {
  const { featureConfig } = getOrgData();

  const { travelDate, legs, travellers, products } = tripPatternPriceProps;
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

  // includes length check for products
  const requestBodyRes = TripPatternPriceRequestBodySchema.safeParse({
    travellers,
    travelDate: travelDate.toISOString(),
    products,
    legs: legsToGetPriceFrom,
    isOnBehalfOf: false,
  });

  return useSWRImmutable<TripPatternPriceResponse>(
    featureConfig.enableShowTripPatternPrice && requestBodyRes.success
      ? ['/api/assistant/trip-pattern-price', requestBodyRes.data]
      : null,
    swrPostFetcher,
  );
}
