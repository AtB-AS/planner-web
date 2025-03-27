import { BookingStatus } from './types';
import {
  dateWithReplacedTime,
  iso8601DurationToSeconds,
  secondsBetween,
} from '@atb/utils/date';
import { BookingArrangementType } from '@atb/page-modules/assistant';
import { TripWithDetailsLineFragment } from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip-with-details.generated.ts';
import { TripLineFragment } from '@atb/page-modules/assistant/server/journey-planner/journey-gql/trip.generated.ts';

export const isLineFlexibleTransport = (
  line?: TripWithDetailsLineFragment | TripLineFragment,
) => !!line?.flexibleLineType;

export const getBookingStatus = (
  bookingArrangements: BookingArrangementType | null,
  aimedStartTime: string,
  flexBookingNumberOfDaysAvailable?: number,
): BookingStatus => {
  if (!bookingArrangements) return 'none';

  const secondsToDeadline = getSecondsRemainingToBookingDeadline(
    bookingArrangements,
    aimedStartTime,
    Date.now(),
  );

  if (secondsToDeadline < 0) {
    return 'late';
  }

  if (flexBookingNumberOfDaysAvailable) {
    const secondsBeforehandItCanBeBooked =
      flexBookingNumberOfDaysAvailable * 24 * 60 * 60;
    if (secondsToDeadline > secondsBeforehandItCanBeBooked) {
      return 'early';
    }
  }

  return 'bookable';
};

export function getLatestBookingDate(
  bookingArrangements: BookingArrangementType,
  aimedStartTime: string,
): Date {
  const latestBookingTime = bookingArrangements?.latestBookingTime; // e.g. '15:16:00'

  const aimedStartDate = new Date(aimedStartTime);
  let latestBookingDate = new Date(aimedStartTime);

  const bookWhen = bookingArrangements?.bookWhen;
  if (bookWhen === 'timeOfTravelOnly') {
    return latestBookingDate; // note: 'timeOfTravelOnly' is deprecated
  } else if (
    bookWhen === 'dayOfTravelOnly' ||
    bookWhen === 'untilPreviousDay' ||
    bookWhen === 'advanceAndDayOfTravel'
  ) {
    if (aimedStartDate && latestBookingTime) {
      latestBookingDate = dateWithReplacedTime(
        aimedStartDate,
        latestBookingTime,
        'HH:mm:ss',
      );
    }

    if (bookWhen !== 'dayOfTravelOnly') {
      if (
        latestBookingDate.getTime() > aimedStartDate.getTime() ||
        bookWhen === 'untilPreviousDay'
      ) {
        latestBookingDate.setDate(latestBookingDate.getDate() - 1);
      }
    }
  } else if (bookWhen === undefined || bookWhen === null) {
    const minimumBookingPeriod = bookingArrangements?.minimumBookingPeriod;
    if (minimumBookingPeriod) {
      latestBookingDate.setSeconds(
        latestBookingDate.getSeconds() -
          iso8601DurationToSeconds(minimumBookingPeriod),
      );
    }
  }

  return latestBookingDate;
}

export function getEarliestBookingDate(
  bookingArrangements: BookingArrangementType,
  aimedStartTime: string,
  flexBookingNumberOfDaysAvailable: number,
): Date {
  const latestBookingDate = getLatestBookingDate(
    bookingArrangements,
    aimedStartTime,
  );

  const earliestBookingDate = new Date(latestBookingDate);
  earliestBookingDate.setDate(
    earliestBookingDate.getDate() - flexBookingNumberOfDaysAvailable,
  );

  return earliestBookingDate;
}

export function getSecondsRemainingToBookingDeadline(
  bookingArrangements: BookingArrangementType,
  aimedStartTime: string,
  now: number,
): number {
  const latestBookingDate = getLatestBookingDate(
    bookingArrangements,
    aimedStartTime,
  );
  return secondsBetween(new Date(now), latestBookingDate);
}
