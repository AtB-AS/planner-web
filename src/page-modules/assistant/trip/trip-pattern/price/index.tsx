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
import { MonoIcon } from '@atb/components/icon';

type PriceProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  inView: boolean;
  size?: 'small' | 'regular';
  showIcon?: boolean;
  showNotFoundText?: boolean;
};

export function Price({
  tripPattern,
  inView,
  size = 'regular',
  showIcon = true,
  showNotFoundText = true,
}: PriceProps) {
  const { t, language } = useTranslation();
  const { featureConfig } = getOrgData();

  const shouldFetch =
    featureConfig.enableShowTripPatternPrice &&
    inView &&
    !disableForTripPattern(tripPattern);

  const {
    data: price,
    error,
    isLoading: isLoadingPrice,
  } = useTripPatternPrice(
    new Date(tripPattern.legs[0].serviceDate),
    tripPattern.legs,
    shouldFetch,
  );

  if (isLoadingPrice) {
    return <Loading text={t(PageText.Assistant.trip.tripPattern.loading)} />;
  }

  const textType = size === 'small' ? 'body__secondary' : 'body__primary';

  if (error && error.statusCode === 404 && showNotFoundText) {
    return (
      <Typo.span textType={textType} className={style.text}>
        {t(PageText.Assistant.trip.tripPattern.noPrice)}
      </Typo.span>
    );
  }

  if (!price) {
    if (showNotFoundText) {
      return (
        <Typo.span textType={textType} className={style.text}>
          {t(PageText.Assistant.trip.tripPattern.noPrice)}
        </Typo.span>
      );
    }

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
      {showIcon && <MonoIcon icon="ticketing/Ticket" />}
      <Typo.span textType={textType} className={style.text}>
        {`${travellerTypeText}: ${priceInfoText}`}
      </Typo.span>
    </div>
  );
}

/**
 * Handles edge case for trips with both boat and bus or train legs
 * should be removed once the search trippattern endpoint supports it
 */
function disableForTripPattern(
  tp: ExtendedTripPatternWithDetailsType,
): boolean {
  const isBoatLeg = (leg: ExtendedLegType) =>
    leg.mode === Mode.Water &&
    leg.transportSubmode &&
    isSubModeBoat([leg.transportSubmode]);

  const isBusOrTrainLeg = (leg: ExtendedLegType) =>
    leg.mode === Mode.Bus || leg.mode === Mode.Rail;

  const hasBoatLeg = tp.legs.some(isBoatLeg);
  const hasBusOrTrainLeg = tp.legs.some(isBusOrTrainLeg);

  return hasBoatLeg && hasBusOrTrainLeg;
}
