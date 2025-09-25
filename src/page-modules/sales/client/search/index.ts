import useSWRImmutable from 'swr/immutable';
import { swrPostFetcher } from '@atb/modules/api-browser';
import {
  ExtendedLegType,
  LegToGetOfferFrom,
  LegToGetOfferFromSchema,
  OfferFromLegsBody,
  OfferFromLegsResponse,
  Traveller,
} from '@atb/page-modules/assistant';
import { getOrgData } from '@atb/modules/org-data';
import { isDefined } from '@atb/utils/presence';

export function useOfferFromLegs(offerFromLegsProps: {
  travelDate: Date;
  legs: ExtendedLegType[];
  travellers: Traveller[];
  products: string[];
}) {
  const { featureConfig } = getOrgData();

  const { travelDate, legs, travellers, products } = offerFromLegsProps;
  const legsToGetOfferFrom: LegToGetOfferFrom[] = legs
    .map(
      (leg) =>
        LegToGetOfferFromSchema.safeParse({
          fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
          toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
          serviceJourneyId: leg.serviceJourney?.id,
          mode: leg.mode,
          travelDate: leg.expectedStartTime.split('T')[0],
        }).data,
    )
    .filter(isDefined);

  const requestBody: OfferFromLegsBody = {
    travellers,
    travelDate: travelDate.toISOString(),
    products,
    legs: legsToGetOfferFrom,
    isOnBehalfOf: false,
  };

  return useSWRImmutable<OfferFromLegsResponse>(
    featureConfig.enableShowTripPatternPrice
      ? ['/api/assistant/offer-from-legs', requestBody]
      : null,
    swrPostFetcher,
  );
}
