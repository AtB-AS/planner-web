/**
 * Per-organization tariff rules for the dev ticket calculator. Everything here
 * is org-specific — zone names, the fare-zone connection graph, validity windows
 * and prices — so only orgs with a config get a ticket plan; others yield none
 * rather than wrong numbers. Add an org by creating a new file in this folder
 * and registering it in `index.ts`.
 */
export type TariffConfig = {
  // FareZone id (e.g. "ATB:FareZone:7") -> readable zone name (e.g. "C6").
  zoneNames: Record<string, string>;
  // Two-way fare-zone connection graph, keyed by zone name. Travel between two
  // connected zones is billed as 2 zones regardless of any zone passed through;
  // the billed count between any two zones is the shortest hops along this graph
  // + 1.
  connections: Record<string, string[]>;
  // A single ticket is valid `baseValidityMin` for the first zone plus
  // `extraZoneValidityMin` per additional zone, and only needs to be valid at
  // boarding (not for the whole journey).
  baseValidityMin: number;
  extraZoneValidityMin: number;
  // A single ticket costs `singleTicketBaseKr` for the first zone plus
  // `extraZoneKr` per additional zone.
  singleTicketBaseKr: number;
  extraZoneKr: number;
  // A day (24h) ticket is valid in a single zone only and costs a flat
  // `dayTicketKr`. It's suggested only for single-zone trips that need more than
  // `maxSingleTicketsBeforeDayTicket` single tickets (by then the singles cost at
  // least as much, and the day ticket is valid 24h rather than 90 min each).
  dayTicketKr: number;
  maxSingleTicketsBeforeDayTicket: number;
};
