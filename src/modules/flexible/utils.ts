import {
  TripPattern,
  TripPatternWithDetails,
} from '@atb/page-modules/assistant/server/journey-planner/validators';
import {
  BookingArrangement,
  BookingStatus,
  TripPatternBookingStatus,
} from './types';
import {
  dateWithReplacedTime,
  iso8601DurationToSeconds,
  secondsBetween,
} from '@atb/utils/date';

export const isLineFlexibleTransport = (
  line?:
    | TripPatternWithDetails['legs'][0]['line']
    | TripPattern['legs'][0]['line'],
) => !!line?.flexibleLineType;

export const getBookingStatus = (
  bookingArrangements: BookingArrangement | null,
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

export function getTripPatternBookingStatus(
  tripPattern: TripPatternWithDetails,
  now?: number,
): TripPatternBookingStatus {
  return tripPattern?.legs?.reduce<TripPatternBookingStatus>((status, leg) => {
    if (status === 'late') return status;

    const currentLegStatus = getBookingStatus(
      leg.bookingArrangements,
      leg.aimedStartTime,
      now,
    );

    switch (currentLegStatus) {
      case 'none':
        return status;
      case 'late':
        return 'late';
      case 'early':
      case 'bookable':
        return 'bookable';
    }
  }, 'none');
}

export const bookingStatusToMsgType = (
  bookingStatus: BookingStatus,
): 'warning' | 'error' | undefined => {
  switch (bookingStatus) {
    case 'none':
      return undefined;
    case 'early':
    case 'bookable':
      return 'warning';
    case 'late':
      return 'error';
  }
};

export function getIsTooLateToBookFlexLine(
  tripPattern: TripPatternWithDetails,
): boolean {
  return tripPattern?.legs?.some(
    (leg) =>
      leg.line?.flexibleLineType &&
      getBookingStatus(leg.bookingArrangements, leg.aimedStartTime) === 'late',
  );
}

export function getLatestBookingDate(
  bookingArrangements: BookingArrangement,
  aimedStartTime: string,
): Date {
  const latestBookingTime = bookingArrangements.latestBookingTime; // e.g. '15:16:00'

  const aimedStartDate = new Date(aimedStartTime);
  let latestBookingDate = new Date(aimedStartTime);

  const bookWhen = bookingArrangements.bookWhen;
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
  }
  return latestBookingDate;
}

export function getEarliestBookingDate(
  bookingArrangements: BookingArrangement,
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
  bookingArrangements: BookingArrangement,
  aimedStartTime: string,
  now: number,
): number {
  const latestBookingDate = getLatestBookingDate(
    bookingArrangements,
    aimedStartTime,
  );
  return secondsBetween(new Date(now), latestBookingDate);
}
