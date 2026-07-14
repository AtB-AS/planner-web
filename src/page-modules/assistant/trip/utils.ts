import {
  LegWithDetailsFragment,
  QuayFragment,
} from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import {
  formatToClock,
  formatTripDuration,
  isInPast,
  secondsBetween,
} from '@atb/utils/date.ts';
import { getBookingStatus } from '@atb/modules/flexible';
import { StatusType } from './travel-card/travel-card-header/status-text';
import { Language, TranslateFunction } from '@atb/translations';
import { Assistant } from '@atb/translations/pages';
import { getTimeRepresentationType } from '@atb/modules/time-representation';
import { humanizeDistance } from '@atb/utils/distance.ts';
import { screenReaderPause } from '@atb/components/typography';
import { PageText } from '@atb/translations';
import { transportModeToTranslatedString } from '@atb/modules/transport-mode';
import dictionary from '@atb/translations/dictionary.ts';
import { Leg } from '@atb/modules/graphql-types';
import { isDefined } from '@atb/utils/presence';
import { onlyUniques } from '@atb/utils/only-uniques';

export const tripSummary = (
  tripPattern: ExtendedTripPatternWithDetailsType,
  t: TranslateFunction,
  language: Language,
  listPosition: number,
) => {
  const humanizedDistance = humanizeDistance(tripPattern.legs[0].distance, t);

  let startText = '';

  if (tripPattern.legs[0]?.mode === 'foot' && tripPattern.legs[1]) {
    const quayName = getQuayOrPlaceName(
      t,
      tripPattern.legs[1]?.fromPlace.quay,
      tripPattern.legs[1]?.fromPlace.name,
    );

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
    const quayName = getQuayOrPlaceName(
      t,
      tripPattern.legs[0]?.fromPlace.quay,
      tripPattern.legs[0]?.fromPlace.name,
    );
    if (quayName) {
      startText = t(
        PageText.Assistant.trip.tripSummary.header.title(
          t(transportModeToTranslatedString(tripPattern.legs[0].mode)),
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
  const modeAndNumberText = firstLeg
    ? t(transportModeToTranslatedString(firstLeg.mode)) +
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

  const status = getTripPatternStatus(tripPattern);
  const statusConfig = getStatusConfig(status, t);
  const statusText =
    status === 'cancelled'
      ? t(PageText.Assistant.trip.tripPattern.isCancelled.label)
      : status === 'requiresBooking' && bookingsRequiredCount > 0
        ? undefined
        : statusConfig?.text;

  const { aimedStartTime, aimedEndTime } =
    getTripPatternAimedTimes(tripPattern);
  const originalTimesText = shouldShowAimedTime(tripPattern)
    ? t(
        PageText.Assistant.trip.tripSummary.journeySummary.originalTripTimes(
          formatToClock(aimedStartTime, language, 'floor'),
          formatToClock(aimedEndTime, language, 'ceil'),
        ),
      )
    : undefined;

  const texts = [
    resultNumberText,
    statusText,
    requiresBookingText,
    startText,
    modeAndNumberText,
    realTimeText,
    numberOfFootLegsText,
    walkDistanceText,
    travelTimesText,
    originalTimesText,
  ].filter((text) => text !== undefined);

  return texts.join(screenReaderPause);
};

export type TripPatternStatusType =
  | 'cancelled'
  | 'impossible'
  | 'ended'
  | 'started'
  | 'bookingDeadlineExceeded'
  | 'requiresBooking'
  | 'stale';

export type StatusConfig = {
  statusType: StatusType;
  text: string;
};

export function getTripPatternStatus(
  tripPattern: ExtendedTripPatternWithDetailsType,
): TripPatternStatusType | undefined {
  if (tripPattern.legs.some((leg) => leg.fromEstimatedCall?.cancellation))
    return 'cancelled';
  if (tripPattern.status === 'impossible') return 'impossible';
  if (isInPast(tripPattern.expectedEndTime)) return 'ended';
  if (isInPast(tripPattern.expectedStartTime)) return 'started';

  const bookingLegs = tripPattern.legs.filter((leg) => leg.bookingArrangements);
  if (bookingLegs.length > 0) {
    const anyDeadlineExceeded = bookingLegs.some(
      (leg) =>
        getBookingStatus(leg.bookingArrangements!, leg.aimedStartTime) ===
        'late',
    );
    return anyDeadlineExceeded ? 'bookingDeadlineExceeded' : 'requiresBooking';
  }

  if (tripPattern.status === 'stale') return 'stale';
  return undefined;
}

export function getStatusConfig(
  status: TripPatternStatusType | undefined,
  t: TranslateFunction,
): StatusConfig | undefined {
  const statusTexts = PageText.Assistant.trip.tripPattern.statusText;
  switch (status) {
    case 'cancelled':
      return { statusType: 'error', text: t(statusTexts.cancelled) };
    case 'impossible':
      return { statusType: 'error', text: t(statusTexts.impossible) };
    case 'ended':
      return { statusType: 'error', text: t(statusTexts.ended) };
    case 'started':
      return { statusType: 'info', text: t(statusTexts.started) };
    case 'bookingDeadlineExceeded':
      return {
        statusType: 'interactive',
        text: t(statusTexts.bookingDeadlineExceeded),
      };
    case 'requiresBooking':
      return { statusType: 'info', text: t(statusTexts.requiresBooking) };
    case 'stale':
      return { statusType: 'info', text: t(statusTexts.stale) };
    default:
      return undefined;
  }
}

const DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS = 60;

export function getTripPatternAimedTimes(
  tripPattern: ExtendedTripPatternWithDetailsType,
) {
  return {
    aimedStartTime:
      tripPattern.aimedStartTime ?? tripPattern.legs[0]?.aimedStartTime,
    aimedEndTime:
      tripPattern.aimedEndTime ??
      tripPattern.legs[tripPattern.legs.length - 1]?.aimedEndTime,
  };
}

export function shouldShowAimedTime(
  tripPattern: ExtendedTripPatternWithDetailsType,
): boolean {
  const { aimedStartTime, aimedEndTime } =
    getTripPatternAimedTimes(tripPattern);
  const startTimeDiffers =
    Math.abs(secondsBetween(aimedStartTime, tripPattern.expectedStartTime)) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  const endTimeDiffers =
    Math.abs(secondsBetween(aimedEndTime, tripPattern.expectedEndTime)) >
    DEFAULT_THRESHOLD_AIMED_EXPECTED_IN_SECONDS;
  return startTimeDiffers || endTimeDiffers;
}

export function isLegFlexibleTransport(leg: LegWithDetailsFragment): boolean {
  return !!leg.line?.flexibleLineType;
}

export function getFilteredLegsByWalkOrWaitTime(
  tripPattern: ExtendedTripPatternWithDetailsType,
): ExtendedLegType[] {
  const legs = tripPattern.legs;
  return legs.filter((leg, i) =>
    isSignificantFootLegWalkOrWaitTime(leg, legs[i + 1]),
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

function isSignificantFootLegWalkOrWaitTime(
  leg: LegWithDetailsFragment,
  nextLeg?: LegWithDetailsFragment,
) {
  if (leg.mode !== 'foot') return true;

  const showWaitTime = !!nextLeg;
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const mustWalk = significantWalkTime(leg.duration);
  const mustWait = showWaitTime && significantWaitTime(waitTimeInSeconds);

  return mustWait || mustWalk;
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

function isSignificantDifference(leg: LegWithDetailsFragment) {
  return (
    getTimeRepresentationType({
      missingRealTime: !leg.realtime,
      aimedTime: leg.aimedStartTime,
      expectedTime: leg.expectedStartTime,
      cancelled: leg.fromEstimatedCall?.cancellation ?? false,
    }) === 'significant-difference'
  );
}

function getTripPatternBookingsRequiredCount(
  tripPattern: ExtendedTripPatternWithDetailsType,
): number {
  return tripPattern?.legs?.filter((leg) => getLegRequiresBooking(leg)).length;
}

function getLegRequiresBooking(leg: LegWithDetailsFragment): boolean {
  return isLegFlexibleTransport(leg);
}

/**
 * Collects a single value from every leg across all trip patterns, dropping
 * nullish values and de-duplicating the result. Used to derive rule-engine
 * inputs (transport modes, authorities, etc.) from a set of trip patterns.
 */
export const uniqueLegValues = <T>(
  tripPatterns: { legs: ExtendedLegType[] }[],
  selector: (leg: ExtendedLegType) => T | undefined | null,
): NonNullable<T>[] =>
  tripPatterns
    .flatMap((tp) => tp.legs)
    .map(selector)
    .filter(isDefined)
    .filter(onlyUniques);
