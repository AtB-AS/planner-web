import { describe, it, expect } from 'vitest';
import { computeTicketPlan, type OwnedTicket } from '../utils';
import type { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { Mode } from '@atb/modules/graphql-types';

// FareZone ids → names for AtB (mirrors tariff/atb.ts).
const ZONE_ID: Record<string, string> = {
  A: 'ATB:FareZone:10',
  B1: 'ATB:FareZone:6',
  C6: 'ATB:FareZone:7',
  D: 'ATB:FareZone:2',
};

function place(zone: keyof typeof ZONE_ID) {
  return {
    name: zone,
    quay: { tariffZones: [{ id: ZONE_ID[zone], name: zone }] },
  };
}

/** Minimal transit leg between two zones at a given Oslo wall-clock time. */
function leg(
  from: keyof typeof ZONE_ID,
  to: keyof typeof ZONE_ID,
  startIso: string,
  publicCode = 'bus',
) {
  return {
    mode: Mode.Bus,
    expectedStartTime: startIso,
    line: { publicCode },
    fromPlace: place(from),
    toPlace: place(to),
  };
}

function trip(legs: unknown[]): ExtendedTripPatternWithDetailsType {
  return { legs } as unknown as ExtendedTripPatternWithDetailsType;
}

const T = (hhmm: string) => `2026-06-15T${hhmm}:00+02:00`;

describe('computeTicketPlan — owned tickets', () => {
  it('bills the un-owned remainder of the route (A→C6→D with a period-A ticket)', () => {
    const pattern = trip([
      leg('A', 'C6', T('08:00')),
      leg('C6', 'D', T('08:20')),
    ]);
    const owned: OwnedTicket[] = [{ zones: ['A'] }];

    const plan = computeTicketPlan(pattern, { ownedTickets: owned });
    const bought = plan!.tickets.filter((t) => !t.fullyCovered);

    expect(bought).toHaveLength(1);
    expect(bought[0].fromZone).toBe('C6');
    expect(bought[0].toZone).toBe('D');
    expect(bought[0].zoneCount).toBe(2);
    expect(bought[0].priceKr).toBe(100);
    expect(bought[0].validityMinutes).toBe(150);
    expect(plan!.singleTotalKr).toBe(100);
  });

  it('without owned tickets bills the whole A→C6→D route (3 zones)', () => {
    const pattern = trip([
      leg('A', 'C6', T('08:00')),
      leg('C6', 'D', T('08:20')),
    ]);

    const plan = computeTicketPlan(pattern);
    const bought = plan!.tickets.filter((t) => !t.fullyCovered);

    expect(bought).toHaveLength(1);
    expect(bought[0].fromZone).toBe('A');
    expect(bought[0].toZone).toBe('D');
    expect(bought[0].zoneCount).toBe(3);
    expect(bought[0].priceKr).toBe(150);
    expect(plan!.singleTotalKr).toBe(150);
  });

  it('marks a trip fully covered when the owned ticket spans every zone', () => {
    const pattern = trip([leg('A', 'C6', T('08:00'))]);
    const owned: OwnedTicket[] = [{ zones: ['A', 'C6'] }];

    const plan = computeTicketPlan(pattern, { ownedTickets: owned });
    const bought = plan!.tickets.filter((t) => !t.fullyCovered);

    expect(bought).toHaveLength(0);
    expect(plan!.singleTotalKr).toBe(0);
    expect(plan!.tickets[0].fullyCovered).toBe(true);
    expect(plan!.tickets[0].coveredZones).toEqual(['A', 'C6']);
  });

  it('forces a re-buy once the owned ticket expires mid-trip', () => {
    // Two same-zone (A) boardings 2h apart; owned A ticket has 30 min left.
    const pattern = trip([
      leg('A', 'A', T('08:00')),
      leg('A', 'A', T('10:00')),
    ]);
    const owned: OwnedTicket[] = [{ zones: ['A'], remainingMinutes: 30 }];

    const plan = computeTicketPlan(pattern, { ownedTickets: owned });

    // First boarding (08:00) covered; second (10:00, past 08:30 expiry) bought.
    expect(plan!.tickets[0].fullyCovered).toBe(true);
    const bought = plan!.tickets.filter((t) => !t.fullyCovered);
    expect(bought).toHaveLength(1);
    expect(bought[0].zoneCount).toBe(1);
    expect(bought[0].priceKr).toBe(50);
  });

  it('returns null when there are no transit legs', () => {
    const pattern = trip([
      {
        mode: Mode.Foot,
        expectedStartTime: T('08:00'),
        fromPlace: place('A'),
        toPlace: place('A'),
      },
    ]);
    expect(computeTicketPlan(pattern)).toBeNull();
  });
});
