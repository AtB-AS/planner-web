import { Map } from '@atb/components/map';
import { MonoIcon } from '@atb/components/icon';
import { PageText, useTranslation } from '@atb/translations';
import { secondsBetween, secondsToDurationShort } from '@atb/utils/date';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { PriceSummaryRow } from './price-summary-row';
import { SummaryRow } from './summary-row';
import style from './trip-summary-panel.module.css';

type TripSummaryPanelProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
};

export function TripSummaryPanel({ tripPattern }: TripSummaryPanelProps) {
  const { t, language } = useTranslation();

  const mapLegs = tripPattern.legs.flatMap(
    (leg: ExtendedLegType) => leg.mapLegs,
  );

  const duration = secondsToDurationShort(
    secondsBetween(tripPattern.expectedStartTime, tripPattern.expectedEndTime),
    language,
  );
  const walkDistance = (tripPattern.streetDistance ?? 0).toFixed();

  return (
    <div className={style.container}>
      <div className={style.mapContainer} tabIndex={-1}>
        <Map mapLegs={mapLegs} aria-hidden />
      </div>
      <div className={style.summaryCard}>
        <PriceSummaryRow tripPattern={tripPattern} />
        <SummaryRow
          icon={<MonoIcon icon="time/Duration" />}
          value={duration}
          label={t(PageText.Assistant.details.summaryPanel.travelTimeLabel)}
        />
        <SummaryRow
          icon={<MonoIcon icon="transportation/WalkFill" />}
          value={t(
            PageText.Assistant.details.summaryPanel.walkDistanceValue(
              walkDistance,
            ),
          )}
          label={t(PageText.Assistant.details.summaryPanel.walkDistanceLabel)}
        />
      </div>
    </div>
  );
}
