import {
  TripPattern,
  Quay,
  TripPatternWithDetails,
} from '../../../server/journey-planner/validators';
import style from './trip-pattern-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText, TranslateFunction } from '@atb/translations';
import { formatTripDuration } from '@atb/utils/date';
import { flatMap } from 'lodash';
import { getNoticesForLeg } from './utils';
import { RailReplacementBusMessage } from './rail-replacement-bus';
import { Notice, SituationOrNoticeIcon } from '@atb/modules/situations';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import { ColorIcon } from '@atb/components/icon';
import { Assistant } from '@atb/translations/pages';

type TripPatternHeaderProps = {
  tripPattern: TripPatternWithDetails;
  isCancelled?: boolean;
};

export function TripPatternHeader({
  tripPattern,
  isCancelled = false,
}: TripPatternHeaderProps) {
  const { t, language } = useTranslation();

  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );

  const startModeAndPlaceText = getStartModeAndPlaceText(tripPattern, t);

  return (
    <header className={style.header}>
      {isCancelled && (
        <ColorIcon
          icon="status/Error"
          className={style.situationIcon}
          alt={t(PageText.Assistant.trip.tripPattern.isCancelled.label)}
        />
      )}
      <Typo.span textType="body__secondary--bold">
        {startModeAndPlaceText}
        {isCancelled &&
          ` (${t(
            PageText.Assistant.trip.tripPattern.isCancelled.title,
          ).toUpperCase()})`}
      </Typo.span>
      <Typo.span textType="body__secondary" className={style.header__duration}>
        {duration}
      </Typo.span>

      <RailReplacementBusMessage tripPattern={tripPattern} />

      <SituationOrNoticeIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        notices={tripPattern.legs.map(getNoticesForLeg).flat()}
        accessibilityLabel={startModeAndPlaceText}
        cancellation={isCancelled}
      />
    </header>
  );
}

export function getStartModeAndPlaceText(
  tripPattern: TripPatternWithDetails,
  t: TranslateFunction,
): string {
  let startLeg = tripPattern.legs[0];
  let tmpStartName = startLeg.fromPlace.name;

  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    startLeg = tripPattern.legs[1];
    tmpStartName = getQuayName(startLeg.fromPlace.quay, t);
  } else if (tripPattern.legs[0].mode !== 'foot') {
    tmpStartName = getQuayName(startLeg.fromPlace.quay, t);
  }

  const startName: string =
    tmpStartName ??
    t(PageText.Assistant.trip.tripPattern.travelFrom.unknownPlace);

  switch (startLeg.mode) {
    case 'bus':
    case 'coach':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.bus(startName));
    case 'tram':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.tram(startName));
    case 'metro':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.metro(startName));
    case 'rail':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.rail(startName));
    case 'water':
      if (
        startLeg.transportSubmode &&
        isSubModeBoat([startLeg.transportSubmode])
      ) {
        return t(
          PageText.Assistant.trip.tripPattern.travelFrom.boat(startName),
        );
      } else {
        return t(
          PageText.Assistant.trip.tripPattern.travelFrom.ferry(startName),
        );
      }
    case 'air':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.air(startName));
    case 'bicycle':
      return t(
        PageText.Assistant.trip.tripPattern.travelFrom.bicycle(startName),
      );
    case 'foot':
      return t(PageText.Assistant.trip.tripPattern.travelFrom.foot(startName));
    default:
      return t(
        PageText.Assistant.trip.tripPattern.travelFrom.unknown(startName),
      );
  }
}

export function getQuayName(
  quay: Quay | null,
  t: TranslateFunction,
): string | undefined {
  if (!quay) return undefined;
  if (!quay.publicCode) return quay.name;
  const prefix = t(Assistant.trip.tripPattern.quayPublicCodePrefix);
  return `${quay.name}${prefix ? prefix : ' '}${quay.publicCode}`;
}
