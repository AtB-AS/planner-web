import {
  TripPattern,
  Quay,
} from '@atb/page-modules/assistant/server/journey-planner/validators';
import style from './trip-pattern-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText } from '@atb/translations';
import { secondsToDuration } from '@atb/utils/date';
import { flatMap } from 'lodash';
import { getNoticesForLeg } from '@atb/page-modules/assistant/trip/trip-pattern/trip-pattern-header/utils';
import { RailReplacementBusMessage } from './rail-replacement-bus';
import { SituationOrNoticeIcon } from '@atb/modules/situations';

type TripPatternHeaderProps = {
  tripPattern: TripPattern;
};

export function TripPatternHeader({ tripPattern }: TripPatternHeaderProps) {
  const { t, language } = useTranslation();

  const duration = secondsToDuration(tripPattern.duration, language);

  const { startMode, startPlace } = getStartModeAndPlace(tripPattern);

  return (
    <header className={style.header}>
      <Typo.span textType="body__secondary--bold">
        {t(
          PageText.Assistant.trip.tripPattern.travelFrom(startMode, startPlace),
        )}
      </Typo.span>
      <Typo.span textType="body__secondary" className={style.header__duration}>
        {duration}
      </Typo.span>

      <RailReplacementBusMessage tripPattern={tripPattern} />

      <SituationOrNoticeIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        notices={flatMap(tripPattern.legs, getNoticesForLeg)}
        accessibilityLabel={t(
          PageText.Assistant.trip.tripPattern.travelFrom(startMode, startPlace),
        )}
      />
    </header>
  );
}

export function getStartModeAndPlace(tripPattern: TripPattern) {
  let startLeg = tripPattern.legs[0];
  let startName = startLeg.fromPlace.name;

  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    startLeg = tripPattern.legs[1];
    startName = getQuayName(startLeg.fromPlace.quay);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    startName = getQuayName(startLeg.fromPlace.quay);
  }

  return {
    startMode: startLeg.mode ?? 'unknown',
    startPlace: startName ?? '',
  };
}

export function getQuayName(quay: Quay | null): string | null {
  if (!quay) return null;
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
