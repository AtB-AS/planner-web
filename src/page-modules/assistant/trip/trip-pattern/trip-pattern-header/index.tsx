import style from './trip-pattern-header.module.css';
import { Typo } from '@atb/components/typography';
import { useTranslation, PageText, TranslateFunction } from '@atb/translations';
import {
  formatToClock,
  formatTripDuration,
  secondsBetween,
  isInPast,
} from '@atb/utils/date';
import { flatMap } from 'lodash';
import { RailReplacementBusMessage } from './rail-replacement-bus';
import { SituationOrNoticeIcon } from '@atb/modules/situations';
import { isSubModeBoat } from '@atb/modules/transport-mode';
import { ColorIcon } from '@atb/components/icon';
import { Assistant } from '@atb/translations/pages';
import { getNoticesForLeg } from '@atb/page-modules/assistant/utils.ts';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { QuayFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

type TripPatternHeaderProps = {
  tripPattern: ExtendedTripPatternWithDetailsType;
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

  const tripIsInPast = isInPast(tripPattern.expectedStartTime);

  const expectedStartTimeLabel = formatToClock(
    tripPattern.expectedStartTime,
    language,
    'floor',
  );
  const expectedEndTimeLabel = formatToClock(
    tripPattern.expectedEndTime,
    language,
    'ceil',
  );

  const aimedStartTime = tripPattern.legs[0]?.aimedStartTime;
  const aimedEndTime =
    tripPattern.legs[tripPattern.legs.length - 1]?.aimedEndTime;

  const aimedStartTimeLabel = formatToClock(aimedStartTime, language, 'floor');
  const aimedEndTimeLabel = formatToClock(aimedEndTime, language, 'ceil');

  const startTimeDiffers =
    secondsBetween(aimedStartTime, tripPattern.expectedStartTime) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const endTimeDiffers =
    secondsBetween(aimedEndTime, tripPattern.expectedEndTime) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const showAimedTime = startTimeDiffers || endTimeDiffers;

  const startModeAndPlaceText = getStartModeAndPlaceText(tripPattern, t);

  return (
    <header className={style.header}>
      <div className={style.header__timesArea}>
        <div className={style.header__timesRow}>
          {isCancelled ? (
            <ColorIcon
              icon="status/Error"
              className={style.situationIcon}
              alt={t(PageText.Assistant.trip.tripPattern.isCancelled.label)}
            />
          ) : (
            <SituationOrNoticeIcon
              situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
              notices={tripPattern.legs.flatMap(getNoticesForLeg)}
              cancellation={isCancelled}
              iconSize="large"
            />
          )}
          <RailReplacementBusMessage tripPattern={tripPattern} />
          <Typo.span textType="body__m__strong" testID="expectedTimeRange">
            {tripIsInPast
              ? t(PageText.Assistant.trip.tripPattern.passedTrip)
              : `${expectedStartTimeLabel} - ${expectedEndTimeLabel}`}
            {isCancelled &&
              ` (${t(
                PageText.Assistant.trip.tripPattern.isCancelled.title,
              ).toUpperCase()})`}
          </Typo.span>
        </div>
        {showAimedTime && !tripIsInPast && (
          <Typo.span
            textType="body__s"
            className={style.header__aimedTime}
            testID="aimedTimeRange"
          >
            {t(PageText.Assistant.trip.tripPattern.originalTime)}{' '}
            {aimedStartTimeLabel} - {aimedEndTimeLabel}
          </Typo.span>
        )}
      </div>
      <div className={style.header__metaArea}>
        <Typo.span
          textType="body__s"
          className={style.header__duration}
          testID="resultDuration"
        >
          {duration}
        </Typo.span>
        <Typo.span textType="body__s" className={style.header__startPlace}>
          {startModeAndPlaceText}
        </Typo.span>
      </div>
    </header>
  );
}

export function getStartModeAndPlaceText(
  tripPattern: ExtendedTripPatternWithDetailsType,
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
        isSubModeBoat(startLeg.transportSubmode)
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
