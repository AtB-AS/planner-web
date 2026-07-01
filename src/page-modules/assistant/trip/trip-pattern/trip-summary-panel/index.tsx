import { MonoIcon } from '@atb/components/icon';
import { PageText, useTranslation } from '@atb/translations';
import { secondsBetween, secondsToDurationShort } from '@atb/utils/date.ts';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { Price } from '../price';
import { SummaryRow } from './summary-row.tsx';
import style from './trip-summary-panel.module.css';

type TripSummaryPanelProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  shouldFetchPrice: boolean;
};

export function TripSummaryPanel({
  tripPattern,
  shouldFetchPrice,
}: TripSummaryPanelProps) {
  const { t, language } = useTranslation();

  const duration = secondsToDurationShort(
    secondsBetween(tripPattern.expectedStartTime, tripPattern.expectedEndTime),
    language,
  );
  const walkDistance = (tripPattern.streetDistance ?? 0).toFixed();

  return (
    <div className={style.summaryCard}>
      <Price
        tripPattern={tripPattern}
        inView={shouldFetchPrice}
        variant="summary"
      />
      <SummaryRow
        icon={<MonoIcon icon="time/Duration" />}
        value={duration}
        label={t(PageText.Assistant.details.mapSection.travelTimeLabel)}
      />
      <SummaryRow
        icon={<MonoIcon icon="transportation/WalkFill" />}
        value={t(
          PageText.Assistant.details.mapSection.walkDistanceValue(walkDistance),
        )}
        label={t(PageText.Assistant.details.mapSection.walkDistanceLabel)}
      />
    </div>
  );
}
