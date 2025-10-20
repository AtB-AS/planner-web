import { Typo } from '@atb/components/typography';
import { getOrgData, WEBSHOP_ORGS } from '@atb/modules/org-data';
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
};

export function Price({ tripPattern }: PriceProps) {
  const { t, language } = useTranslation();
  const { featureConfig, orgId } = getOrgData();

  const isEnabled =
    featureConfig.enableShowTripPatternPrice &&
    !disableForTripPattern(tripPattern, orgId);

  const { data: priceResponse, isLoading: isLoadingPrice } =
    useTripPatternPrice({
      travelDate: new Date(tripPattern.legs[0].serviceDate),
      legs: tripPattern.legs,
      isEnabled,
    });

  if (isLoadingPrice || !priceResponse) {
    return null;
  }

  const travellerTypeText = t(
    PageText.Assistant.trip.tripPattern.userType(priceResponse.userType),
  );
  const priceInfoText = t(
    PageText.Assistant.trip.tripPattern.priceInfo(
      formatNumberToString(priceResponse?.cheapestTotalPrice ?? 0, language),
    ),
  );

  return (
    <Typo.span textType="body__secondary" className={style.priceInfoText}>
      {`${travellerTypeText}: ${priceInfoText}`}
    </Typo.span>
  );
}

/**
 * Handles edge case for AtB for trips with both boat and non-boat legs
 * should be removed once the search trippattern endpoint supports it
 */
function disableForTripPattern(
  tp: ExtendedTripPatternWithDetailsType,
  orgId: WEBSHOP_ORGS,
): boolean {
  const isBoatLeg = (leg: ExtendedLegType) =>
    leg.mode === Mode.Water &&
    leg.transportSubmode &&
    isSubModeBoat([leg.transportSubmode]);

  const hasBoatLeg = tp.legs.some(isBoatLeg);
  const hasNonBoatLeg = tp.legs.some((leg: ExtendedLegType) => !isBoatLeg(leg));

  return orgId === 'atb' && hasBoatLeg && hasNonBoatLeg;
}
