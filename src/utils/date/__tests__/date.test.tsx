import { describe, expect, it } from 'vitest';

import {
  getHoursDifferenceFromCET,
  getLastSundayOfMonthAndSetTime,
  isDaylightSavingTime,
} from '@atb/utils/date';

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
