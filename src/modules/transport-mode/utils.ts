import { ComponentText } from '@atb/translations';
import {
  TransportModeGroup,
  transportModeSchema,
  TransportModeType,
  transportSubmodeSchema,
  TransportSubmodeType,
} from './types';
import { TransportMode as GraphQlTransportMode } from '@atb/modules/graphql-types';

export function transportModeToTranslatedString(mode: TransportModeGroup) {
  if (!ComponentText.TransportMode.modes[mode.mode]) {
    return ComponentText.TransportMode.modes.unknown;
  }
  return ComponentText.TransportMode.modes[mode.mode];
}
export function severalTransportModesToTranslatedStrings(
  modes: TransportModeGroup[],
) {
  return modes
    .map((mode) => ComponentText.TransportMode.modes[mode.mode])
    .filter(Boolean);
}

export function isTransportModeType(a: any): a is TransportModeType {
  return transportModeSchema.safeParse(a).success;
}

export function isTransportSubmodeType(a: any): a is TransportSubmodeType {
  return transportSubmodeSchema.safeParse(a).success;
}

export function filterGraphQlTransportModes(
  modes: GraphQlTransportMode[] | undefined,
): TransportModeType[] | undefined {
  if (!modes) return undefined;
  const transportModes: TransportModeType[] = [];
  modes.forEach((transportMode) => {
    if (isTransportModeType(transportMode)) transportModes.push(transportMode);
  });
  if (transportModes.length === 0) return undefined;
  return transportModes;
}

const TRANSPORT_SUB_MODES_BOAT: TransportSubmodeType[] = [
  'highSpeedPassengerService',
  'highSpeedVehicleService',
  'nationalPassengerFerry',
  'localPassengerFerry',
  'sightseeingService',
];

export function isSubmodeBoat(submode?: TransportSubmodeType) {
  if (!submode) return false;
  return TRANSPORT_SUB_MODES_BOAT.includes(submode);
}
