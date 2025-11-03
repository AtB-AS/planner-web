import { Typo } from '@atb/components/typography';
import { getOrgData, WEBSHOP_ORGS } from '@atb/modules/org-data';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant/types';
import { useTripPatternPrice } from '@atb/page-modules/sales/client/search';
import { PageText, useTranslation } from '@atb/translations';
import { Mode } from '@atb/modules/graphql-types';
import { formatNumberToString } from '@atb-as/utils';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import style from './price.module.css';
import { Loading } from '@atb/components/loading';
import { getBookingStatus } from '@atb/modules/flexible';
import { Tag } from '@atb/components/tag';

type PriceProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  inView: boolean;
};

export function Price({ tripPattern, inView }: PriceProps) {
  const { t, language } = useTranslation();
  const { featureConfig, orgId } = getOrgData();

  const shouldFetch =
    featureConfig.enableShowTripPatternPrice &&
    inView &&
    !disableForTripPattern(tripPattern, orgId);

  const {
    data: price,
    error,
    isLoading: isLoadingPrice,
  } = useTripPatternPrice(
    new Date(tripPattern.legs[0].serviceDate),
    tripPattern.legs,
    shouldFetch,
  );

  const requireTicketBooking = tripPattern.legs.some((leg: ExtendedLegType) => {
    if (!leg.bookingArrangements) return false;
    return (
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime, 7) !==
      'none'
    );
  });

  if (isLoadingPrice) {
    return <Loading text={t(PageText.Assistant.trip.tripPattern.loading)} />;
  }

  if (error && error.statusCode === 404) {
    return (
      <div className={style.container}>
        {requireTicketBooking && (
          <Tag
            type="warning"
            message={t(PageText.Assistant.trip.tripPattern.requiresBooking)}
          />
        )}
        <Typo.span textType="body__secondary" className={style.text}>
          {t(PageText.Assistant.trip.tripPattern.noPrice)}
        </Typo.span>
      </div>
    );
  }

  if (!price) {
    return null;
  }

  const travellerTypeText = t(
    PageText.Assistant.trip.tripPattern.userType(price.userType),
  );
  const priceInfoText = t(
    PageText.Assistant.trip.tripPattern.priceInfo(
      formatNumberToString(price?.cheapestTotalPrice ?? 0, language),
    ),
  );

  return (
    <div className={style.container}>
      {requireTicketBooking && (
        <Tag
          type="warning"
          message={t(PageText.Assistant.trip.tripPattern.requiresBooking)}
        />
      )}
      <Typo.span textType="body__secondary" className={style.text}>
        {`${travellerTypeText}: ${priceInfoText}`}
      </Typo.span>
    </div>
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
