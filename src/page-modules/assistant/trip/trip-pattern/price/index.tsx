import { Typo } from '@atb/components/typography';
import { getOrgData } from '@atb/modules/org-data';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
  Traveller,
} from '@atb/page-modules/assistant/types';
import { useTripPatternPrice } from '@atb/page-modules/sales/client/search';
import { PageText, useTranslation } from '@atb/translations';
import { Mode } from '@atb/modules/graphql-types';
import { formatNumberToString } from '@atb-as/utils';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import style from './price.module.css';

type PriceProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  productIdsAvailableForTripPatternPrice?: string[];
};

export function Price({
  tripPattern,
  productIdsAvailableForTripPatternPrice,
}: PriceProps) {
  const { t, language } = useTranslation();
  const { featureConfig } = getOrgData();

  const adultTraveller: Traveller = {
    id: 'adultAnonymousTraveller',
    userType: 'ADULT',
  };
  const travellers = [adultTraveller]; // we don't know who the user is, so always default to adult which is non-discounted

  let products = productIdsAvailableForTripPatternPrice ?? [];

  // edge case for AtB for trips with both boat and non-boat legs
  // should be removed once the search trippattern endpoint supports it
  if (getOrgData().orgId === 'atb') {
    const isBoatLeg = (leg: ExtendedLegType) =>
      leg.mode === Mode.Water &&
      leg.transportSubmode &&
      isSubModeBoat([leg.transportSubmode]);

    const hasBoatLeg = tripPattern.legs.some(isBoatLeg);
    const hasNonBoatLeg = tripPattern.legs.some(
      (leg: ExtendedLegType) => !isBoatLeg(leg),
    );

    if (hasBoatLeg && hasNonBoatLeg) {
      products = [];
    }
  }

  const {
    data: tripPatternPriceResponse,
    isLoading: isLoadingTripPatternPrice,
  } = useTripPatternPrice({
    travelDate: new Date(tripPattern.legs[0].serviceDate),
    legs: tripPattern.legs,
    travellers,
    products,
  });

  const hasValidPrice =
    typeof tripPatternPriceResponse?.cheapestTotalPrice === 'number' &&
    !isLoadingTripPatternPrice;

  const travellerTypeText = t(
    PageText.Assistant.trip.tripPattern.userType(travellers[0]?.userType),
  );
  const priceInfoText = t(
    PageText.Assistant.trip.tripPattern.priceInfo(
      formatNumberToString(
        tripPatternPriceResponse?.cheapestTotalPrice ?? 0,
        language,
      ),
    ),
  );

  return (
    <Typo.span textType="body__secondary" className={style.priceInfoText}>
      {featureConfig.enableShowTripPatternPrice &&
        hasValidPrice &&
        `${travellerTypeText}: ${priceInfoText}`}
    </Typo.span>
  );
}
