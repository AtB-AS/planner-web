import { describe, expect, it } from 'vitest';

import {
  getHoursDifferenceFromCET,
  getLastSundayOfMonthAndSetTime,
  getSecondsUntilMidnight,
  isDaylightSavingTime,
} from '@atb/utils/date';

const ONE_HOUR_SECONDS = 60 * 60;

describe('isDaylightSavingTime', () => {
  const winterTime = new Date(2024, 0, 2);
  const summerTime = new Date(2024, 6, 2);

  it(`should rejects that date ${winterTime} is within daylight saving time (DST).`, () => {
    const isWhitinDST = isDaylightSavingTime(winterTime);
    expect(isWhitinDST).toBeFalsy();
  });

  it(`should confime that date ${summerTime} is within daylight saving time (DST).`, () => {
    const isWhitinDST = isDaylightSavingTime(summerTime);
    expect(isWhitinDST).toBeTruthy();
  });
});

describe('getCETOffset', () => {
  const timezones = [
    { name: 'Asia/Tokyo', etcOffsetWinterTime: 8, etcOffsetSummerTime: 7 },
    { name: 'Europe/Helsinki', etcOffsetWinterTime: 1, etcOffsetSummerTime: 1 },
    { name: 'Europe/Oslo', etcOffsetWinterTime: 0, etcOffsetSummerTime: 0 },
    { name: 'Europe/London', etcOffsetWinterTime: -1, etcOffsetSummerTime: -1 },
    {
      name: 'America/Los_Angeles',
      etcOffsetWinterTime: -9,
      etcOffsetSummerTime: -9,
    },
    {
      name: 'Asia/Kolkata',
      etcOffsetWinterTime: 4.5,
      etcOffsetSummerTime: 3.5,
    },
  ];

  timezones.forEach((timezone) => {
    it(`should return the offset from Europe/Oslo to ${timezone.name}.`, () => {
      const winterTime = new Date(2024, 0, 2);
      let hoursDifference = getHoursDifferenceFromCET(
        winterTime.getTime(),
        timezone.name,
      );
      expect(hoursDifference).toEqual(timezone.etcOffsetWinterTime);
    });

    it(`should return the offset from Europe/Oslo to ${timezone.name} when DST in Norway.`, () => {
      const summerTime = new Date(2024, 6, 2);
      let hoursDifference = getHoursDifferenceFromCET(
        summerTime.getTime(),
        timezone.name,
      );
      expect(hoursDifference).toEqual(timezone.etcOffsetSummerTime);
    });
  });
});

describe('getSecondsUntilMidnight', () => {
  // All inputs use explicit UTC/offset markers, so the expected values are
  // independent of the machine's timezone. They only hold if "midnight" is
  // resolved in Oslo (Europe/Oslo), which is what these tests verify.

  it('counts seconds to the end of the Oslo day in winter (CET, UTC+1)', () => {
    // 22:30Z in winter is 23:30 in Oslo -> 30 minutes left.
    expect(getSecondsUntilMidnight('2024-01-15T22:30:00Z')).toEqual(
      0.5 * ONE_HOUR_SECONDS,
    );
  });

  it('counts seconds to the end of the Oslo day in summer (CEST, UTC+2)', () => {
    // 12:00Z in summer is 14:00 in Oslo -> 10 hours left.
    expect(getSecondsUntilMidnight('2024-07-15T12:00:00Z')).toEqual(
      10 * ONE_HOUR_SECONDS,
    );
  });

  it('uses the Oslo calendar day, not the UTC one', () => {
    // 23:30Z is still 15 Jan in UTC, but already 00:30 on 16 Jan in Oslo,
    // so it should count to the *next* Oslo midnight (23.5h), not 30 minutes.
    expect(getSecondsUntilMidnight('2024-01-15T23:30:00Z')).toEqual(
      23.5 * ONE_HOUR_SECONDS,
    );
  });

  it('returns a full day when given Oslo midnight', () => {
    expect(getSecondsUntilMidnight('2024-07-15T00:00:00+02:00')).toEqual(
      24 * ONE_HOUR_SECONDS,
    );
  });

  it('returns 25 hours across the autumn DST fall-back (CEST -> CET)', () => {
    // 27 Oct 2024 in Oslo has 25 hours (clocks go back 03:00 -> 02:00).
    expect(getSecondsUntilMidnight('2024-10-27T00:00:00+02:00')).toEqual(
      25 * ONE_HOUR_SECONDS,
    );
  });

  it('returns 23 hours across the spring DST forward-shift (CET -> CEST)', () => {
    // 31 Mar 2024 in Oslo has 23 hours (clocks go forward 02:00 -> 03:00).
    expect(getSecondsUntilMidnight('2024-03-31T00:00:00+01:00')).toEqual(
      23 * ONE_HOUR_SECONDS,
    );
  });
});

describe('getLastSundayOfMonthWithTime', () => {
  it('should return the date of the last sunday in given year, month, and with specified time.', () => {
    const year = 2024;
    const march = 2;
    const day = 31;
    const hour = 2;

    const dateLastSundayInMarch2024 = new Date(year, march, day, hour);
    const result = getLastSundayOfMonthAndSetTime(year, march, hour);

    expect(result).toEqual(dateLastSundayInMarch2024);
  });

  it('should return the date of the last sunday in given year, month, and with specified time.', () => {
    const year = 2024;
    const october = 9;
    const day = 27;
    const hour = 3;

    const dateLastSundayInOctober2024 = new Date(year, october, day, hour);
    const result = getLastSundayOfMonthAndSetTime(year, october, hour);

    expect(result).toEqual(dateLastSundayInOctober2024);
  });
});
