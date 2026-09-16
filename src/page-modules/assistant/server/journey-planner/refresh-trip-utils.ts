import { addSeconds, parseISO } from 'date-fns';
import { isTransitLeg, TransferRisk, type TransferLeg } from '@atb-as/utils';
import type { TripPatternStatus } from '../../types';

/**
 * Pure utilities for refreshing a single trip pattern. Transfer risk comes from
 * `@atb-as/utils`, shared with the app and atb-bff; the time adjustments mirror
 * atb-bff's singleTrip v3 (src/service/impl/trips/utils.ts), but serialize as
 * UTC ISO strings rather than its local-offset formatISO — same instants.
 */

/** `TransferLeg` plus the fields the time adjustments read. */
export type RefreshableLeg = TransferLeg & {
  duration: number;
  distance: number;
  aimedEndTime: string;
  refreshedAt?: string;
  transferRisk?: TransferRisk;
};

// Transfer risk and its trip-level aggregation come from @atb-as/utils,
// shared with atb-bff and the app. Re-exported so callers keep one import.
export { withTransferRisk, getTripTransferRisk } from '@atb-as/utils';

/**
 * Computes the trip-level aimedStartTime and aimedEndTime.
 *
 * Entur quirk: non-transit legs (foot, bicycle, etc.) have no real scheduled
 * times — their aimed times are always equal to their expected times. To get
 * correct trip-level aimed boundaries, we derive them from the nearest transit
 * legs and subtract/add the non-transit leg durations.
 */
export function computeTripAimedStartEnd(legs: RefreshableLeg[]): {
  aimedStartTime: string;
  aimedEndTime: string;
} {
  if (legs.length === 0) {
    return { aimedStartTime: '', aimedEndTime: '' };
  }

  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  let aimedStartTime = firstLeg.aimedStartTime;
  let aimedEndTime = lastLeg.aimedEndTime;

  if (legs.some((leg) => !isTransitLeg(leg))) {
    if (!isTransitLeg(firstLeg)) {
      const firstTransitIndex = legs.findIndex(isTransitLeg);
      if (firstTransitIndex !== -1) {
        const firstTransit = legs[firstTransitIndex];
        const durationBefore = legs
          .slice(0, firstTransitIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        aimedStartTime = addSeconds(
          parseISO(firstTransit.aimedStartTime),
          -durationBefore,
        ).toISOString();
      }
    }

    if (!isTransitLeg(lastLeg)) {
      const reversedLegs = [...legs].reverse();
      const lastTransitIndex = reversedLegs.findIndex(isTransitLeg);
      if (lastTransitIndex !== -1) {
        const lastTransit = reversedLegs[lastTransitIndex];
        const durationAfter = reversedLegs
          .slice(0, lastTransitIndex)
          .reduce((acc, leg) => acc + leg.duration, 0);
        aimedEndTime = addSeconds(
          parseISO(lastTransit.aimedEndTime),
          durationAfter,
        ).toISOString();
      }
    }
  }

  return { aimedStartTime, aimedEndTime };
}

const STALE_THRESHOLD_SECONDS = 10;

/**
 * Data freshness only — transfer risk is a separate axis, see
 * `withTransferRisk`. A failed RefreshLeg(id) leaves its leg with an old
 * `refreshedAt` while the rest get a fresh one; more than
 * STALE_THRESHOLD_SECONDS behind the newest leg counts as stale.
 *
 * Compared against the newest leg rather than `Date.now()`, so a slow batch of
 * parallel refreshes does not mark its early legs stale.
 */
export function determineTripStatus(legs: RefreshableLeg[]): TripPatternStatus {
  if (hasStaleLegs(legs)) {
    return 'stale';
  }
  return 'valid';
}

function hasStaleLegs(legs: RefreshableLeg[]): boolean {
  const timestamps = legs
    .map((leg) => leg.refreshedAt)
    .filter((t): t is string => t != null)
    .map((t) => new Date(t).getTime())
    .filter((t) => !isNaN(t));

  if (timestamps.length === 0) {
    return false;
  }

  const newest = Math.max(...timestamps);
  return timestamps.some((t) => newest - t > STALE_THRESHOLD_SECONDS * 1000);
}

/**
 * Re-anchors non-transit legs to the adjacent transit legs. Refreshing only
 * updates transit legs, so walk times still reflect the original schedule even
 * when the bus around them has shifted.
 *
 * - Leading/trailing: derived from the first/last transit leg. At most one of
 *   each, matching how Entur structures trip patterns.
 * - Intermediate: chain forward from the previous transit leg's
 *   expectedEndTime; any gap left before the next transit leg is wait time.
 *
 * Transit legs, and all legs on a trip with none, are returned unchanged.
 */
export function adjustNonTransitExpectedTimes<T extends RefreshableLeg>(
  legs: T[],
): T[] {
  const firstTransitIndex = legs.findIndex(isTransitLeg);
  if (firstTransitIndex === -1) {
    return legs;
  }

  const lastTransitIndex = findLastIndex(legs, isTransitLeg);

  return legs.map((leg, i) => {
    if (isTransitLeg(leg)) return leg;

    // Leading: the leg immediately before the first transit leg
    if (i === firstTransitIndex - 1) {
      const transitStart = parseISO(legs[firstTransitIndex].expectedStartTime);
      return {
        ...leg,
        expectedStartTime: addSeconds(
          transitStart,
          -leg.duration,
        ).toISOString(),
        expectedEndTime: transitStart.toISOString(),
      };
    }

    // Trailing: the leg immediately after the last transit leg
    if (i === lastTransitIndex + 1) {
      const transitEnd = parseISO(legs[lastTransitIndex].expectedEndTime);
      return {
        ...leg,
        expectedStartTime: transitEnd.toISOString(),
        expectedEndTime: addSeconds(transitEnd, leg.duration).toISOString(),
      };
    }

    // Intermediate: start at the previous transit leg's end, offset by any
    // non-transit legs in between (0 for the common single walk, so the walk
    // starts exactly when the bus arrives). Assumes those legs run back to
    // back, with any wait time falling after the last of them.
    const prevTransitIdx = findLastIndex(legs.slice(0, i), isTransitLeg);
    const durationBefore = legs
      .slice(prevTransitIdx + 1, i)
      .reduce((acc, l) => acc + l.duration, 0);
    const anchor = parseISO(legs[prevTransitIdx].expectedEndTime);
    const start = addSeconds(anchor, durationBefore);
    return {
      ...leg,
      expectedStartTime: start.toISOString(),
      expectedEndTime: addSeconds(start, leg.duration).toISOString(),
    };
  });
}

// Array.prototype.findLastIndex requires an ES2023 target, which this project
// does not use. This is a simple polyfill.
function findLastIndex<T>(arr: T[], predicate: (item: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}
