import useSWRImmutable from 'swr/immutable';
import {
  ExtendedLegType,
  LegToGetOfferFrom,
  LegToGetOfferFromSchema,
  OfferFromLegsBody,
  OfferFromLegsResponse,
  Traveller,
} from '../../types';
import { swrPostFetcher } from '@atb/modules/api-browser';

export function useOfferFromLegs(offerFromLegsProps: {
  travelDate: Date;
  legs: ExtendedLegType[];
  travellers: Traveller[];
  products: string[];
}) {
  const { travelDate, legs, travellers, products } = offerFromLegsProps;
  const legsToGetOfferFrom: LegToGetOfferFrom[] = legs.flatMap((leg) => {
    const parsedLegToGetOfferFrom = LegToGetOfferFromSchema.safeParse({
      fromStopPlaceId: leg.fromPlace.quay?.stopPlace?.id,
      toStopPlaceId: leg.toPlace.quay?.stopPlace?.id,
      serviceJourneyId: leg.serviceJourney?.id,
      mode: leg.mode,
      travelDate: leg.expectedStartTime.split('T')[0],
    });
    return parsedLegToGetOfferFrom.success
      ? [parsedLegToGetOfferFrom.data]
      : [];
  });

  const requestBody: OfferFromLegsBody = {
    travellers,
    travelDate: travelDate.toISOString(),
    products,
    legs: legsToGetOfferFrom,
    isOnBehalfOf: false,
  };

  return useSWRImmutable<OfferFromLegsResponse>(
    [
      process.env.NEXT_PUBLIC_API_BASE_URL + '/v1/search/trip-pattern',
      requestBody,
    ],
    swrPostFetcher,
  );
}
