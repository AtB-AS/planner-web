import { cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  getBookingStatus,
  getEarliestBookingDate,
  getLatestBookingDate,
  isLineFlexibleTransport,
} from '../utils';
import { PurchaseWhen } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

afterEach(function () {
  cleanup();
});

describe('is line flexible transport', function () {
  it('should be flexible transport line', () => {
    expect(
      isLineFlexibleTransport({
        name: 'Rundtur',
        publicCode: 'O',
        flexibleLineType: 'flex',
        notices: [],
      }),
    ).toBe(true);
  });

  it('should not be flexible transport line', () => {
    expect(isLineFlexibleTransport(undefined)).toBe(false);
  });
});

describe('booking status', function () {
  it('should have booking status none', () => {
    const bookingArrangements = null;
    const aimedStartTime = '2022-01-01T00:00:00';
    const flexBookingNumberOfDaysAvailable = 7;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime,
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('none');
  });

  it('should have booking status late', () => {
    const aimedStartTime = new Date();
    aimedStartTime.setMonth(aimedStartTime.getMonth() - 1);

    // Latest booking time is 2 hours before aimed start time
    const latestBookingTime = new Date(aimedStartTime.getTime());
    latestBookingTime.setHours(latestBookingTime.getHours() - 2);

    const hours = String(latestBookingTime.getHours()).padStart(2, '0');
    const minutes = String(latestBookingTime.getMinutes()).padStart(2, '0');
    const seconds = String(latestBookingTime.getSeconds()).padStart(2, '0');
    const latestBookingTimeStr = `${hours}:${minutes}:${seconds}`;

    const bookingArrangements = {
      bookingMethods: undefined,
      latestBookingTime: latestBookingTimeStr,
      bookingNote: undefined,
      bookWhen: undefined,
      minimumBookingPeriod: undefined,
      bookingContact: undefined,
    };

    const flexBookingNumberOfDaysAvailable = 7;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime.toISOString(),
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('late');
  });

  it('should have booking status early', () => {
    const aimedStartTime = new Date();
    aimedStartTime.setMonth(aimedStartTime.getMonth() + 1);

    // Latest booking time is 2 hours before aimed start time
    const latestBookingTime = new Date(aimedStartTime.getTime());
    latestBookingTime.setHours(latestBookingTime.getHours() - 2);

    const hours = String(latestBookingTime.getHours()).padStart(2, '0');
    const minutes = String(latestBookingTime.getMinutes()).padStart(2, '0');
    const seconds = String(latestBookingTime.getSeconds()).padStart(2, '0');
    const latestBookingTimeStr = `${hours}:${minutes}:${seconds}`;

    const bookingArrangements = {
      bookingMethods: undefined,
      latestBookingTime: latestBookingTimeStr,
      bookingNote: undefined,
      bookWhen: undefined,
      minimumBookingPeriod: undefined,
      bookingContact: undefined,
    };

    const flexBookingNumberOfDaysAvailable = 7;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime.toISOString(),
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('early');
  });

  it('should have booking status bookable', async () => {
    const aimedStartTime = new Date();
    aimedStartTime.setDate(aimedStartTime.getDate() + 5);

    // Latest booking time is 2 hours before aimed start time
    const latestBookingTime = new Date(aimedStartTime.getTime());
    latestBookingTime.setHours(latestBookingTime.getHours() - 2);

    const hours = String(latestBookingTime.getHours()).padStart(2, '0');
    const minutes = String(latestBookingTime.getMinutes()).padStart(2, '0');
    const seconds = String(latestBookingTime.getSeconds()).padStart(2, '0');
    const latestBookingTimeStr = `${hours}:${minutes}:${seconds}`;

    const bookingArrangements = {
      bookingMethods: undefined,
      latestBookingTime: latestBookingTimeStr,
      bookingNote: undefined,
      bookWhen: undefined,
      minimumBookingPeriod: undefined,
      bookingContact: undefined,
    };

    const flexBookingNumberOfDaysAvailable = 7;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime.toISOString(),
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('bookable');
  });

  it('should have booking status early because of flexBookingNumberOfDaysAvailable', async () => {
    const aimedStartTime = new Date();
    aimedStartTime.setDate(aimedStartTime.getDate() + 5);

    // Latest booking time is 2 hours before aimed start time
    const latestBookingTime = new Date(aimedStartTime.getTime());
    latestBookingTime.setHours(latestBookingTime.getHours() - 2);

    const hours = String(latestBookingTime.getHours()).padStart(2, '0');
    const minutes = String(latestBookingTime.getMinutes()).padStart(2, '0');
    const seconds = String(latestBookingTime.getSeconds()).padStart(2, '0');
    const latestBookingTimeStr = `${hours}:${minutes}:${seconds}`;

    const bookingArrangements = {
      bookingMethods: undefined,
      latestBookingTime: latestBookingTimeStr,
      bookingNote: undefined,
      bookWhen: undefined,
      minimumBookingPeriod: undefined,
      bookingContact: undefined,
    };

    const flexBookingNumberOfDaysAvailable = 2;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime.toISOString(),
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('early');
  });

  it('should have booking status late', async () => {
    const aimedStartTime = new Date();
    aimedStartTime.setDate(aimedStartTime.getDate() - 2);

    const latestBookingTimeStr = '00:00:00';

    const bookingArrangements = {
      bookingMethods: undefined,
      latestBookingTime: latestBookingTimeStr,
      bookingNote: undefined,
      bookWhen: undefined,
      minimumBookingPeriod: undefined,
      bookingContact: undefined,
    };

    const flexBookingNumberOfDaysAvailable = 8;
    expect(
      getBookingStatus(
        bookingArrangements,
        aimedStartTime.toISOString(),
        flexBookingNumberOfDaysAvailable,
      ),
    ).toBe('late');
  });

  describe('earliest booking date', function () {
    it('should have earliest booking date', async () => {
      const aimedStartTime = new Date('2024-01-20T00:00:00');
      const latestBookingTime = '15:00:00';

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: latestBookingTime,
        bookingNote: undefined,
        bookWhen: undefined,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      const flexBookingNumberOfDaysAvailable = 7;
      expect(
        getEarliestBookingDate(
          bookingArrangements,
          aimedStartTime.toISOString(),
          flexBookingNumberOfDaysAvailable,
        ),
      ).toEqual(new Date('2024-01-13T00:00:00'));
    });

    it('should have earliest booking date', async () => {
      const aimedStartTime = new Date('2024-01-25T00:00:00');

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: undefined,
        bookingNote: undefined,
        bookWhen: undefined,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      const flexBookingNumberOfDaysAvailable = 5;
      expect(
        getEarliestBookingDate(
          bookingArrangements,
          aimedStartTime.toISOString(),
          flexBookingNumberOfDaysAvailable,
        ),
      ).toEqual(new Date('2024-01-20T00:00:00'));
    });
  });

  describe('latest booking date', function () {
    it('should have latest booking date', async () => {
      const aimedStartTime = '2024-01-20T20:00:00';
      const latestBookingTime = '13:00:00';

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: latestBookingTime,
        bookingNote: undefined,
        bookWhen: PurchaseWhen.DayOfTravelOnly,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      expect(getLatestBookingDate(bookingArrangements, aimedStartTime)).toEqual(
        new Date('2024-01-20T13:00:00'),
      );
    });

    it('should have latest booking date', async () => {
      const aimedStartTime = new Date('2024-01-25T00:00:00Z');

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: undefined,
        bookingNote: undefined,
        bookWhen: undefined,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      expect(
        getLatestBookingDate(bookingArrangements, aimedStartTime.toISOString()),
      ).toEqual(new Date('2024-01-25T00:00:00Z'));
    });

    it('should have latest booking date', async () => {
      const aimedStartTime = '2024-01-20T20:00:00';
      const latestBookingTime = '13:00:00';

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: latestBookingTime,
        bookingNote: undefined,
        bookWhen: PurchaseWhen.UntilPreviousDay,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      expect(getLatestBookingDate(bookingArrangements, aimedStartTime)).toEqual(
        new Date('2024-01-19T13:00:00'),
      );
    });

    it('should have latest booking date', async () => {
      const aimedStartTime = '2024-01-20T20:00:00';
      const latestBookingTime = '13:00:00';

      const bookingArrangements = {
        bookingMethods: undefined,
        latestBookingTime: latestBookingTime,
        bookingNote: undefined,
        bookWhen: PurchaseWhen.UntilPreviousDay,
        minimumBookingPeriod: undefined,
        bookingContact: undefined,
      };

      expect(getLatestBookingDate(bookingArrangements, aimedStartTime)).toEqual(
        new Date('2024-01-19T13:00:00'),
      );
    });
  });
});
