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
  /** Whether to fetch the trip price (gates the network request). */
  shouldFetchPrice: boolean;
  /**
   * 'card' (default) uses a compact map for the expanded result card; 'page'
   * uses the taller map of the standalone details page.
   */
  mapHeight?: 'card' | 'page';
};

/**
 * The map + summary card shown beside the trip timeline: route map on top,
 * then price, total travel time and total walk distance. Shared by the
 * expanded search-result card and the details page.
 */
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
