import { TransferRisk } from '@atb-as/utils';
import { describe, expect, it } from 'vitest';
import {
  adjustNonTransitExpectedTimes,
  computeTripAimedStartEnd,
  determineTripStatus,
  withTransferRisk,
  worstTransferRisk,
  type RefreshableLeg,
} from '../server/journey-planner/refresh-trip-utils';

// Ported from atb-bff src/service/impl/trips/__tests__/utils.test.ts so web
// and app share the same refresh semantics. Expected time strings are UTC
// (planner-web serializes with toISOString) where the BFF uses local-offset
// formatISO — same instants.

function makeTransitLeg(
  overrides: Partial<RefreshableLeg> = {},
): RefreshableLeg {
  return {
    distance: 1000,
    duration: 600,
    aimedStartTime: '2024-01-01T10:00:00.000Z',
    aimedEndTime: '2024-01-01T10:10:00.000Z',
    expectedStartTime: '2024-01-01T10:00:00.000Z',
    expectedEndTime: '2024-01-01T10:10:00.000Z',
    serviceJourney: { id: 'ATB:ServiceJourney:test' },
    ...overrides,
  };
}

function makeFootLeg(overrides: Partial<RefreshableLeg> = {}): RefreshableLeg {
  return {
    distance: 500,
    duration: 300,
    aimedStartTime: '2024-01-01T09:55:00.000Z',
    aimedEndTime: '2024-01-01T10:00:00.000Z',
    expectedStartTime: '2024-01-01T09:55:00.000Z',
    expectedEndTime: '2024-01-01T10:00:00.000Z',
    serviceJourney: null,
    ...overrides,
  };
}

describe('withTransferRisk / worstTransferRisk', () => {
  it('stamps the risk on the leg you might miss, not the one before', () => {
    const legs = withTransferRisk([
      makeTransitLeg({ expectedEndTime: '2024-01-01T10:10:00.000Z' }),
      makeTransitLeg({ expectedStartTime: '2024-01-01T10:09:00.000Z' }),
    ]);
    expect(legs[0].transferRisk).toBeUndefined();
    expect(legs[1].transferRisk).toBe(TransferRisk.Uncertain);
    expect(worstTransferRisk(legs)).toBe(TransferRisk.Uncertain);
  });

  it('leaves legs untouched when there is time to spare', () => {
    const legs = withTransferRisk([
      makeTransitLeg({ expectedEndTime: '2024-01-01T10:10:00.000Z' }),
      makeTransitLeg({ expectedStartTime: '2024-01-01T10:15:00.000Z' }),
    ]);
    expect(worstTransferRisk(legs)).toBeUndefined();
  });

  it('does not stamp a guaranteed transfer', () => {
    const legs = withTransferRisk([
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: { guaranteed: true },
      }),
      makeTransitLeg({ expectedStartTime: '2024-01-01T10:00:00.000Z' }),
    ]);
    expect(worstTransferRisk(legs)).toBeUndefined();
  });

  it('stamps once the guaranteed maximum wait time is exceeded', () => {
    const legs = withTransferRisk([
      makeTransitLeg({
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        interchangeTo: { guaranteed: true, maximumWaitTime: 300 },
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:08:00.000Z',
        expectedStartTime: '2024-01-01T10:08:00.000Z',
      }),
    ]);
    expect(worstTransferRisk(legs)).toBe(TransferRisk.Unlikely);
  });

  it('clears a risk echoed back by the client when the gap is now fine', () => {
    // The browser POSTs the pattern back, so legs arrive pre-stamped.
    const legs = withTransferRisk([
      makeTransitLeg({ expectedEndTime: '2024-01-01T10:10:00.000Z' }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        transferRisk: TransferRisk.Unlikely,
      }),
    ]);
    expect(legs[1].transferRisk).toBeUndefined();
    expect(worstTransferRisk(legs)).toBeUndefined();
  });

  it('reports the worst risk across legs', () => {
    const legs = withTransferRisk([
      makeTransitLeg({ expectedEndTime: '2024-01-01T10:10:00.000Z' }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:09:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
      }),
      makeTransitLeg({ expectedStartTime: '2024-01-01T10:14:00.000Z' }),
    ]);
    expect(legs[1].transferRisk).toBe(TransferRisk.Uncertain);
    expect(legs[2].transferRisk).toBe(TransferRisk.Unlikely);
    expect(worstTransferRisk(legs)).toBe(TransferRisk.Unlikely);
  });
});

describe('computeTripAimedStartEnd', () => {
  it('returns aimed times from first and last leg when all are transit', () => {
    const legs = [
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:00:00.000Z',
        aimedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeTransitLeg({
        aimedStartTime: '2024-01-01T10:15:00.000Z',
        aimedEndTime: '2024-01-01T10:25:00.000Z',
      }),
    ];
    const result = computeTripAimedStartEnd(legs);
    expect(result.aimedStartTime).toBe('2024-01-01T10:00:00.000Z');
    expect(result.aimedEndTime).toBe('2024-01-01T10:25:00.000Z');
  });

  it('derives aimed start from first transit leg when first leg is foot', () => {
    const footLeg = makeFootLeg({ duration: 300 });
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T11:00:00+01:00',
      aimedEndTime: '2024-01-01T11:10:00+01:00',
    });
    const result = computeTripAimedStartEnd([footLeg, transitLeg]);
    // 11:00+01:00 (= 10:00Z) - 300 seconds = 09:55Z
    expect(result.aimedStartTime).toBe('2024-01-01T09:55:00.000Z');
    expect(result.aimedEndTime).toBe('2024-01-01T11:10:00+01:00');
  });

  it('derives aimed end from last transit leg when last leg is foot', () => {
    const transitLeg = makeTransitLeg({
      aimedStartTime: '2024-01-01T11:00:00+01:00',
      aimedEndTime: '2024-01-01T11:10:00+01:00',
    });
    const footLeg = makeFootLeg({ duration: 300 });
    const result = computeTripAimedStartEnd([transitLeg, footLeg]);
    expect(result.aimedStartTime).toBe('2024-01-01T11:00:00+01:00');
    // 11:10+01:00 (= 10:10Z) + 300 seconds = 10:15Z
    expect(result.aimedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('returns empty strings when legs array is empty', () => {
    const result = computeTripAimedStartEnd([]);
    expect(result.aimedStartTime).toBe('');
    expect(result.aimedEndTime).toBe('');
  });
});

describe('adjustNonTransitExpectedTimes', () => {
  it('adjusts leading foot leg based on first transit leg', () => {
    const legs = [
      makeFootLeg({ duration: 300 }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:05:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // 10:05 - 300s = 10:00
    expect(result[0].expectedStartTime).toBe('2024-01-01T10:00:00.000Z');
    expect(result[0].expectedEndTime).toBe('2024-01-01T10:05:00.000Z');
  });

  it('adjusts trailing foot leg based on last transit leg', () => {
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({ duration: 300 }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // 10:10 + 300s = 10:15
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('adjusts intermediate foot leg based on previous transit leg', () => {
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({ duration: 180 }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:20:00.000Z',
        expectedEndTime: '2024-01-01T10:30:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // Walk starts at 10:10 (bus 1 end), ends at 10:10 + 180s = 10:13
    // Gap 10:13 → 10:20 is wait time
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:13:00.000Z');
  });

  it('does not modify transit legs', () => {
    const legs = [
      makeFootLeg({ duration: 300 }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:05:00.000Z',
        expectedEndTime: '2024-01-01T10:15:00.000Z',
      }),
      makeFootLeg({ duration: 300 }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:05:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:15:00.000Z');
  });

  it('returns legs unchanged when there are no transit legs', () => {
    const legs = [
      makeFootLeg({
        expectedStartTime: '2024-01-01T09:55:00.000Z',
        expectedEndTime: '2024-01-01T10:00:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    expect(result[0].expectedStartTime).toBe('2024-01-01T09:55:00.000Z');
    expect(result[0].expectedEndTime).toBe('2024-01-01T10:00:00.000Z');
  });

  it('chains multiple consecutive intermediate non-transit legs', () => {
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
      }),
      makeFootLeg({ duration: 120 }),
      makeFootLeg({ duration: 60 }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:20:00.000Z',
        expectedEndTime: '2024-01-01T10:30:00.000Z',
      }),
    ];
    const result = adjustNonTransitExpectedTimes(legs);
    // First walk: 10:10 → 10:12
    expect(result[1].expectedStartTime).toBe('2024-01-01T10:10:00.000Z');
    expect(result[1].expectedEndTime).toBe('2024-01-01T10:12:00.000Z');
    // Second walk: 10:12 → 10:13
    expect(result[2].expectedStartTime).toBe('2024-01-01T10:12:00.000Z');
    expect(result[2].expectedEndTime).toBe('2024-01-01T10:13:00.000Z');
  });
});

describe('determineTripStatus', () => {
  it('returns valid when the only overlap is at a guaranteed interchange', () => {
    const now = new Date().toISOString();
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        interchangeTo: { guaranteed: true },
        refreshedAt: now,
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:09:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        refreshedAt: now,
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns valid when legs are sequential', () => {
    const now = new Date().toISOString();
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: now,
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now,
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('leaves an overlapping trip valid, reporting it as transferRisk', () => {
    const now = new Date().toISOString();
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        refreshedAt: now,
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now,
      }),
    ];
    // Overlap is no longer a status; it surfaces as transferRisk.
    expect(determineTripStatus(legs)).toBe('valid');
    expect(worstTransferRisk(withTransferRisk(legs))).toBe(
      TransferRisk.Unlikely,
    );
  });

  it('returns stale when a leg has an old refreshedAt', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 60_000).toISOString();
    const legs = [
      makeTransitLeg({ refreshedAt: now }),
      makeTransitLeg({ refreshedAt: old }),
    ];
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('returns valid when all legs have similar refreshedAt', () => {
    const now = new Date();
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: new Date(now.getTime() - 2000).toISOString(),
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: now.toISOString(),
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });

  it('returns stale even when legs overlap', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 60_000).toISOString();
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:20:00.000Z',
        refreshedAt: now,
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: old,
      }),
    ];
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('should not crash or mask staleness when refreshedAt contains invalid dates', () => {
    const now = new Date().toISOString();
    const old = new Date(Date.now() - 30_000).toISOString();
    const legs = [
      makeTransitLeg({ refreshedAt: now }),
      makeTransitLeg({ refreshedAt: 'not-a-valid-date' }),
      makeTransitLeg({ refreshedAt: old }),
    ];
    // The invalid date is filtered out; staleness is still detected between
    // now and old
    expect(determineTripStatus(legs)).toBe('stale');
  });

  it('should return valid when all refreshedAt values are invalid', () => {
    const legs = [
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:00:00.000Z',
        expectedEndTime: '2024-01-01T10:10:00.000Z',
        refreshedAt: 'invalid',
      }),
      makeTransitLeg({
        expectedStartTime: '2024-01-01T10:15:00.000Z',
        expectedEndTime: '2024-01-01T10:25:00.000Z',
        refreshedAt: 'also-invalid',
      }),
    ];
    expect(determineTripStatus(legs)).toBe('valid');
  });
});
