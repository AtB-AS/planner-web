import { Map } from '@atb/components/map';
import { MonoIcon } from '@atb/components/icon';
import { PageText, useTranslation } from '@atb/translations';
import { secondsBetween, secondsToDurationShort } from '@atb/utils/date';
import { humanizeDistance } from '@atb/utils/distance';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { PriceSummaryRow } from './price-summary-row';
import { SummaryRow } from './summary-row';
import { and } from '@atb/utils/css';
import style from './trip-summary-panel.module.css';

type Props = {
  tripPattern: ExtendedTripPatternWithDetailsType;
} & (
  | { variant: 'expanded' }
  | { variant: 'compact'; onDetailsClick: () => void }
);

export function TripSummaryPanel(props: Props) {
  const { tripPattern, variant } = props;
  const { t, language } = useTranslation();

  const mapLegs = tripPattern.legs.flatMap(
    (leg: ExtendedLegType) => leg.mapLegs,
  );

  const duration = secondsToDurationShort(
    secondsBetween(tripPattern.expectedStartTime, tripPattern.expectedEndTime),
    language,
  );
  const walkDistance = humanizeDistance(tripPattern.walkDistance ?? 0, t);

  const mapContainerClassName = and(
    style.mapContainer,
    variant === 'expanded' && style.mapContainer__expanded,
  );

  return (
    <div
      className={and(
        style.container,
        variant === 'expanded' && style.container__expanded,
      )}
    >
      {variant === 'compact' ? (
        <div
          onClick={props.onDetailsClick}
          className={and(mapContainerClassName, style.mapContainer__clickable)}
          aria-hidden="true"
        >
          <Map mapLegs={mapLegs} interactive={false} />
        </div>
      ) : (
        <div className={mapContainerClassName}>
          <Map mapLegs={mapLegs} />
        </div>
      )}
      <div className={style.summaryCard}>
        <PriceSummaryRow tripPattern={tripPattern} />
        <SummaryRow
          icon={<MonoIcon icon="time/Duration" />}
          value={duration}
          label={t(PageText.Assistant.details.summaryPanel.travelTimeLabel)}
        />
        <SummaryRow
          icon={<MonoIcon icon="transportation/WalkFill" />}
          value={walkDistance}
          label={t(PageText.Assistant.details.summaryPanel.walkDistanceLabel)}
        />
      </div>
    </div>
  );
}
