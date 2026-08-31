import type { TariffConfig } from './types';

// AtB (Trøndelag) tariff. Connection graph verified against the official
// "Relasjoner" relation table; prices/validity per AtB's single-ticket rules.
export const atbTariff: TariffConfig = {
  zoneNames: {
    'ATB:FareZone:10': 'A',
    'ATB:FareZone:6': 'B1',
    'ATB:FareZone:11': 'B2',
    'ATB:FareZone:9': 'B3',
    'ATB:FareZone:4': 'C1',
    'ATB:FareZone:5': 'C2',
    'ATB:FareZone:12': 'C3',
    'ATB:FareZone:13': 'C4',
    'ATB:FareZone:8': 'C5',
    'ATB:FareZone:7': 'C6',
    'ATB:FareZone:2': 'D',
    'ATB:FareZone:3': 'E1',
    'ATB:FareZone:1': 'E2',
  },
  connections: {
    A: ['B1', 'B2', 'B3', 'C2', 'C3', 'C5', 'C6'],
    B1: ['A', 'B2', 'B3', 'C1', 'C6'],
    B2: ['A', 'B1', 'B3', 'C3', 'C4'],
    B3: ['A', 'B1', 'B2', 'C5'],
    C1: ['B1', 'D'],
    C2: ['A'],
    C3: ['A', 'B2'],
    C4: ['B2'],
    C5: ['A', 'B3'],
    C6: ['A', 'B1', 'D'],
    D: ['C1', 'C6', 'E1', 'E2'],
    E1: ['D'],
    E2: ['D'],
  },
  baseValidityMin: 90,
  extraZoneValidityMin: 60,
  singleTicketBaseKr: 50,
  extraZoneKr: 50,
  dayTicketKr: 150,
  maxSingleTicketsBeforeDayTicket: 2,
};
