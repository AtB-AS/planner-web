import {
  Mode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated';
import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/components/travel-search-filter/types';

enum LegMode {
  AIR = 'air',
  BICYCLE = 'bicycle',
  BUS = 'bus',
  CABLEWAY = 'cableway',
  CAR = 'car',
  COACH = 'coach',
  FOOT = 'foot',
  FUNICULAR = 'funicular',
  LIFT = 'lift',
  METRO = 'metro',
  RAIL = 'rail',
  TRAM = 'tram',
  WATER = 'water',
}

export type AnyMode = LegMode | Mode | TransportModeType | 'flex';
export type AnySubMode = TransportSubmodeType;

const TRANSPORT_SUB_MODES_BOAT: AnySubMode[] = [
  TransportSubmode.HighSpeedPassengerService,
  TransportSubmode.HighSpeedVehicleService,
  TransportSubmode.NationalPassengerFerry,
  TransportSubmode.LocalPassengerFerry,
  TransportSubmode.SightseeingService,
];

export function getTransportModeIconPath(mode?: AnyMode, subMode?: AnySubMode) {
  switch (mode) {
    case 'flex':
    case 'bus':
    case 'coach':
      return 'transportation/Bus';
    case 'tram':
      return 'transportation/Tram';
    case 'rail':
      return 'transportation/Train';
    case 'air':
      return 'transportation-entur/Plane';
    case 'water':
      return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode)
        ? 'transportation/Boat'
        : 'transportation/Ferry';
    case 'foot':
      return 'transportation/Walk';
    case 'metro':
      return 'transportation-entur/Subway';

    case 'bicycle':
      return 'transportation-entur/Bicycle';
    case 'scooter':
      return 'transportation-entur/Scooter';
    case 'unknown':
    default:
      return 'transportation/Unknown';
  }
}
