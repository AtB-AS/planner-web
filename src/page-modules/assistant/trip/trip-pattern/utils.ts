import {
  formatToClock,
  formatTripDuration,
  secondsBetween,
} from '@atb/utils/date';
import {
  Leg,
  TripPattern,
  TripPatternWithDetails,
} from '../../server/journey-planner/validators';
import { getQuayName } from './trip-pattern-header';
import { Language, TranslateFunction, PageText } from '@atb/translations';
import dictionary from '@atb/translations/dictionary';
import { screenReaderPause } from '@atb/components/typography/utils';
import { transportModeToTranslatedString } from '@atb/modules/transport-mode';
import { getTimeRepresentationType } from '@atb/modules/time-representation';

export const tripSummary = (
  tripPattern: TripPatternWithDetails,
  t: TranslateFunction,
  language: Language,
  isInPast: boolean,
  listPosition: number,
  isCancelled: boolean,
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
    const quayName = getQuayName(tripPattern.legs[1]?.fromPlace.quay, t);

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
    const quayName = getQuayName(tripPattern.legs[0]?.fromPlace.quay, t);
    if (quayName) {
      startText = t(
        PageText.Assistant.trip.tripSummary.header.title(
          t(
            transportModeToTranslatedString({
              transportMode: tripPattern.legs[0].mode ?? 'unknown',
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
          transportMode: firstLeg.mode ?? 'unknown',
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

  const { duration } = formatTripDuration(
    tripPattern.expectedStartTime,
    tripPattern.expectedEndTime,
    language,
  );
  const travelTimesText = t(
    PageText.Assistant.trip.tripSummary.journeySummary.travelTimes(
      formatToClock(tripPattern.expectedStartTime, language, 'floor'),
      formatToClock(tripPattern.expectedEndTime, language, 'ceil'),
      duration,
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

  const isCancelledText = isCancelled
    ? t(PageText.Assistant.trip.tripPattern.isCancelled.label)
    : undefined;

  const texts = [
    resultNumberText,
    isCancelledText,
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

function getTripPatternBookingsRequiredCount(
  tripPattern: TripPatternWithDetails,
): number {
  return tripPattern?.legs?.filter((leg) => getLegRequiresBooking(leg)).length;
}

function isSignificantDifference(leg: Leg) {
  return (
    getTimeRepresentationType({
      missingRealTime: !leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
      cancelled: leg.fromEstimatedCall?.cancellation ?? false,
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

export function getFilteredLegsByWalkOrWaitTime(
  tripPattern: TripPatternWithDetails,
) {
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
