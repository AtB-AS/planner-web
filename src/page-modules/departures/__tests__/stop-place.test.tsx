import { describe, it, expect, vi } from 'vitest';
import { isSituationWithinValidityPeriod } from '../stop-place/utils';

// Mock current date for consistent test results
const mockDate = (dateString: string) => {
  const mockNow = new Date(dateString);
  vi.setSystemTime(mockNow);
};

describe('isSituationWithinValidityPeriod', () => {
  it('returns true if current time is within the validity period', () => {
    // Set the mock current date to a specific time
    mockDate('2024-11-22T12:00:00+01:00');

    const validityPeriod = {
      startTime: '2024-11-21T00:00:00+01:00',
      endTime: '2024-11-23T23:59:59+01:00',
    };

    expect(isSituationWithinValidityPeriod(validityPeriod)).toBe(true);
  });

  it('returns false if current time is before the start of the validity period', () => {
    mockDate('2024-11-20T12:00:00+01:00');

    const validityPeriod = {
      startTime: '2024-11-21T00:00:00+01:00',
      endTime: '2024-11-23T23:59:59+01:00',
    };

    expect(isSituationWithinValidityPeriod(validityPeriod)).toBe(false);
  });

  it('returns false if current time is after the end of the validity period', () => {
    mockDate('2024-11-24T12:00:00+01:00');

    const validityPeriod = {
      startTime: '2024-11-21T00:00:00+01:00',
      endTime: '2024-11-23T23:59:59+01:00',
    };

    expect(isSituationWithinValidityPeriod(validityPeriod)).toBe(false);
  });

  it('returns false if startTime or endTime is null', () => {
    mockDate('2024-11-22T12:00:00+01:00');

    const validityPeriodWithNullStart = {
      startTime: null,
      endTime: '2024-11-23T23:59:59+01:00',
    };

    const validityPeriodWithNullEnd = {
      startTime: '2024-11-21T00:00:00+01:00',
      endTime: null,
    };

    expect(isSituationWithinValidityPeriod(validityPeriodWithNullStart)).toBe(
      false,
    );
    expect(isSituationWithinValidityPeriod(validityPeriodWithNullEnd)).toBe(
      false,
    );
  });

  it('returns false if startTime or endTime are invalid date strings', () => {
    mockDate('2024-11-22T12:00:00+01:00');

    const validityPeriodWithInvalidStart = {
      startTime: 'invalid-date',
      endTime: '2024-11-23T23:59:59+01:00',
    };

    const validityPeriodWithInvalidEnd = {
      startTime: '2024-11-21T00:00:00+01:00',
      endTime: 'invalid-date',
    };

    expect(
      isSituationWithinValidityPeriod(validityPeriodWithInvalidStart),
    ).toBe(false);
    expect(isSituationWithinValidityPeriod(validityPeriodWithInvalidEnd)).toBe(
      false,
    );
  });
});
