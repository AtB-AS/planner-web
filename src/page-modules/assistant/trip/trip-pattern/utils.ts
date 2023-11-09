import {
  formatToClock,
  secondsBetween,
  secondsToDuration,
} from '@atb/utils/date';
import { Leg, TripPattern } from '../../server/journey-planner/validators';
import { getQuayName } from './trip-pattern-header';
import { Language, TranslateFunction, PageText } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import { screenReaderPause } from '@atb/components/typography/utils';
import { transportModeToTranslatedString } from '@atb/components/transport-mode';
import { getTimeRepresentationType } from '@atb/modules/time-representation';

export const tripSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
  listPosition: number,
) => {
  const distance = Math.round(tripPattern.legs[0].distance);
  let humanizedDistance;
  if (distance >= 1000) {
    humanizedDistance = `${distance / 1000} ${t(dictionary.distance.km)}`;
  } else {
    humanizedDistance = `${distance} ${t(dictionary.distance.m)}`;
  }

  let startText = '';

  if (tripPattern.legs[0]?.mode === 'foot' && tripPattern.legs[1]) {
    const quayName = getQuayName(tripPattern.legs[1]?.fromPlace.quay);

    {
      quayName
        ? (startText = t(
            PageText.Assistant.trip.tripSummary.footLeg.walkToStopLabel(
              humanizedDistance,
              quayName,
            ),
          ))
        : undefined;
    }
  } else {
    const quayName = getQuayName(tripPattern.legs[0]?.fromPlace.quay);
    if (quayName) {
      startText = t(
        PageText.Assistant.trip.tripSummary.header.title(
          t(
            transportModeToTranslatedString({
              mode: tripPattern.legs[0].mode ?? 'unknown',
            }),
          ),
          quayName,
        ),
      );
    }
  }

  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const firstLeg = nonFootLegs.length > 0 ? nonFootLegs[0] : undefined;

  const resultNumberText = t(
    PageText.Assistant.trip.tripSummary.journeySummary.resultNumber(
      listPosition,
    ),
  );
  const passedTripText = isInPast
    ? t(PageText.Assistant.trip.tripSummary.passedTrip)
    : undefined;

  const modeAndNumberText = firstLeg
    ? t(
        transportModeToTranslatedString({
          mode: firstLeg.mode ?? 'unknown',
        }),
      ) +
      (firstLeg.line?.publicCode
        ? t(
            PageText.Assistant.trip.tripSummary.journeySummary.prefixedLineNumber(
              firstLeg.line.publicCode,
            ),
          )
        : '')
    : undefined;

  const realTimeText = firstLeg
    ? isSignificantDifference(firstLeg)
      ? t(
          PageText.Assistant.trip.tripSummary.journeySummary.realtime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
            formatToClock(firstLeg.aimedStartTime, language, 'floor'),
          ),
        )
      : (isLegFlexibleTransport(firstLeg)
          ? t(dictionary.missingRealTimePrefix)
          : '') +
        t(
          PageText.Assistant.trip.tripSummary.journeySummary.noRealTime(
            firstLeg.fromPlace?.name ?? '',
            formatToClock(firstLeg.expectedStartTime, language, 'floor'),
          ),
        )
    : undefined;

  const numberOfFootLegsText = !nonFootLegs.length
    ? t(
        PageText.Assistant.trip.tripSummary.journeySummary.legsDescription
          .footLegsOnly,
      )
    : nonFootLegs.length === 1
    ? t(
        PageText.Assistant.trip.tripSummary.journeySummary.legsDescription
          .noSwitching,
      )
    : nonFootLegs.length === 2
    ? t(
        PageText.Assistant.trip.tripSummary.journeySummary.legsDescription
          .oneSwitch,
      )
    : t(
        PageText.Assistant.trip.tripSummary.journeySummary.legsDescription.someSwitches(
          nonFootLegs.length - 1,
        ),
      );

  const walkDistance = tripPattern.legs
    .filter((l) => l.mode === 'foot')
    .reduce((tot, { distance }) => tot + distance, 0);
  const walkDistanceText = t(
    PageText.Assistant.trip.tripSummary.journeySummary.totalWalkDistance(
      walkDistance.toFixed(),
    ),
  );

  const filteredLegs = getFilteredLegsByWalkOrWaitTime(tripPattern);
  const startTimeIsApproximation =
    filteredLegs.length > 0 && isLegFlexibleTransport(filteredLegs[0]);
  const endTimeIsApproximation =
    filteredLegs.length > 0 &&
    isLegFlexibleTransport(filteredLegs[filteredLegs.length - 1]);

  const travelTimesText = t(
    PageText.Assistant.trip.tripSummary.journeySummary.travelTimes(
      formatToClock(tripPattern.expectedStartTime, language, 'floor'),
      formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
      secondsToDuration(tripPattern.duration, language),
      startTimeIsApproximation,
      endTimeIsApproximation,
    ),
  );

  const bookingsRequiredCount =
    getTripPatternBookingsRequiredCount(tripPattern);
  const requiresBookingText =
    bookingsRequiredCount > 0
      ? t(
          PageText.Assistant.trip.tripSummary.footer.requiresBooking(
            bookingsRequiredCount,
          ),
        )
      : undefined;

  const texts = [
    resultNumberText,
    requiresBookingText,
    passedTripText,
    startText,
    modeAndNumberText,
    realTimeText,
    numberOfFootLegsText,
    walkDistanceText,
    travelTimesText,
  ].filter((text) => text !== undefined);

  return texts.join(screenReaderPause);
};

function getLegRequiresBooking(leg: Leg): boolean {
  return isLegFlexibleTransport(leg);
}

function getTripPatternBookingsRequiredCount(tripPattern: TripPattern): number {
  return tripPattern?.legs?.filter((leg) => getLegRequiresBooking(leg)).length;
}

function isSignificantDifference(leg: Leg) {
  return (
    getTimeRepresentationType({
      missingRealTime: !leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
    }) === 'significant-difference'
  );
}

const MIN_SIGNIFICANT_WALK_IN_SECONDS = 30;
const MIN_SIGNIFICANT_WAIT_IN_SECONDS = 30;

function significantWalkTime(seconds: number) {
  return seconds > MIN_SIGNIFICANT_WALK_IN_SECONDS;
}

function significantWaitTime(seconds: number) {
  return seconds > MIN_SIGNIFICANT_WAIT_IN_SECONDS;
}

function isSignificantFootLegWalkOrWaitTime(leg: Leg, nextLeg?: Leg) {
  if (leg.mode !== 'foot') return true;

  const showWaitTime = !!nextLeg;
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  return mustWait || mustWalk;
}

export function getFilteredLegsByWalkOrWaitTime(tripPattern: TripPattern) {
  if (!!tripPattern?.legs?.length) {
    return tripPattern.legs.filter((leg, i) =>
      isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
    );
  } else {
    return [];
  }
}

function isLegFlexibleTransport(leg: Leg): boolean {
  return !!leg.line?.flexibleLineType;
}
