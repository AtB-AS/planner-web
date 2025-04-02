import style from './trip-pattern-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText, TranslateFunction } from '@atb/translations';
import { formatTripDuration } from '@atb/utils/date';
import { flatMap } from 'lodash';
import { RailReplacementBusMessage } from './rail-replacement-bus';
import { SituationOrNoticeIcon } from '@atb/modules/situations';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import { ColorIcon } from '@atb/components/icon';
import { Assistant } from '@atb/translations/pages';
import { QuayFragment } from '@atb/page-modules/assistant/journey-gql/trip.generated.ts';
import { getNoticesForLeg } from '@atb/page-modules/assistant/utils.ts';
import { ExtendedTripPatternType } from '@atb/page-modules/assistant';

type TripPatternHeaderProps = {
  tripPattern: ExtendedTripPatternType;
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
        notices={flatMap(tripPattern.legs, getNoticesForLeg)}
        accessibilityLabel={startModeAndPlaceText}
        cancellation={isCancelled}
      />
    </header>
  );
}

export function getStartModeAndPlaceText(
  tripPattern: ExtendedTripPatternType,
  t: TranslateFunction,
): string {
  let startLeg = tripPattern.legs[0];
  let tmpStartName = startLeg.fromPlace.name;

  if (tripPattern.legs[0].mode === 'foot' && tripPattern.legs[1]) {
    startLeg = tripPattern.legs[1];
    tmpStartName = getQuayOrPlaceName(
      t,
      startLeg.fromPlace.quay,
      startLeg.fromPlace.name,
    );
  } else if (tripPattern.legs[0].mode !== 'foot') {
    tmpStartName = getQuayOrPlaceName(
      t,
      startLeg.fromPlace.quay,
      startLeg.fromPlace.name,
    );
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

export function getQuayOrPlaceName(
  t: TranslateFunction,
  quay?: QuayFragment,
  name?: string,
): string | undefined {
  if (!quay) return name;
  if (!quay.publicCode) return quay.name;
  const prefix = t(Assistant.trip.tripPattern.quayPublicCodePrefix);
  return `${quay.name}${prefix ? prefix : ' '}${quay.publicCode}`;
}
