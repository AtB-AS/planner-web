import { MonoIcon } from '@atb/components/icon';
import { getOrgData } from '@atb/modules/org-data';
import { Mode } from '@atb/modules/graphql-types';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant/types';
import { useTripPatternPrice } from '@atb/page-modules/sales/client/search';
import { PageText, useTranslation } from '@atb/translations';
import { formatNumberToString } from '@atb-as/utils';
import { SummaryRow } from './summary-row';

type PriceSummaryRowProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

export function PriceSummaryRow({ tripPattern }: PriceSummaryRowProps) {
  const { t, language } = useTranslation();
  const { featureConfig } = getOrgData();

  const isEnabled = featureConfig.enableShowTripPatternPrice;
  const shouldFetch =
    isEnabled &&
    !disableBoatCombinationTripPatterns(
      tripPattern,
      !!featureConfig.disableBoatComboPriceSearch,
    );

  const { data: price, isLoading } = useTripPatternPrice(
    new Date(tripPattern.legs[0].serviceDate),
    tripPattern.legs,
    shouldFetch,
  );

  if (!isEnabled) return null;

  const ticketIcon = <MonoIcon icon="ticketing/Ticket" />;

  if (isLoading) {
    return (
      <SummaryRow
        icon={ticketIcon}
        value={t(PageText.Assistant.trip.tripPattern.loading)}
      />
    );
  }

  if (!price) return null;

  const travellerTypeText = t(
    PageText.Assistant.trip.tripPattern.userType(price.userType),
  );
  return (
    <SummaryRow
      icon={ticketIcon}
      value={t(
        PageText.Assistant.trip.tripPattern.priceInfo(
          formatNumberToString(price.cheapestTotalPrice ?? 0, language),
        ),
      )}
      label={t(
        PageText.Assistant.details.summaryPanel.priceLabel(
          travellerTypeText.toLowerCase(),
        ),
      )}
    />
  );
}

function disableBoatCombinationTripPatterns(
  tp: ExtendedTripPatternWithDetailsType,
  disableBoatComboPriceSearch: boolean,
): boolean {
  const isBoatLeg = (leg: ExtendedLegType) =>
    leg.mode === Mode.Water &&
    leg.transportSubmode &&
    isSubModeBoat(leg.transportSubmode);
  const isBusOrTrainLeg = (leg: ExtendedLegType) =>
    leg.mode === Mode.Bus || leg.mode === Mode.Rail;
  return (
    tp.legs.some(isBoatLeg) &&
    tp.legs.some(isBusOrTrainLeg) &&
    disableBoatComboPriceSearch
  );
}
