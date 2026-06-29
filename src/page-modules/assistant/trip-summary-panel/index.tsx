import { Map } from '@atb/components/map';
import { MonoIcon } from '@atb/components/icon';
import { PageText, useTranslation } from '@atb/translations';
import { secondsBetween, secondsToDurationShort } from '@atb/utils/date';
import { and } from '@atb/utils/css';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { Price } from '../trip/trip-pattern/price';
import { SummaryRow } from './summary-row';
import style from './trip-summary-panel.module.css';

type TripSummaryPanelProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
  shouldFetchPrice: boolean;
  mapHeight?: 'card' | 'page';
};

export function TripSummaryPanel({
  tripPattern,
  shouldFetchPrice,
  mapHeight = 'card',
}: TripSummaryPanelProps) {
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
      <div
        className={and(
          style.mapContainer,
          mapHeight === 'page' && style.mapContainer__page,
        )}
        tabIndex={-1}
      >
        <Map mapLegs={mapLegs} aria-hidden />
      </div>
      <div className={style.summaryCard}>
        <Price
          tripPattern={tripPattern}
          shouldFetch={shouldFetchPrice}
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
            PageText.Assistant.details.mapSection.walkDistanceValue(
              walkDistance,
            ),
          )}
          label={t(PageText.Assistant.details.mapSection.walkDistanceLabel)}
        />
      </div>
    </div>
  );
}
