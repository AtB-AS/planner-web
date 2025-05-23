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
  if (!mode.transportMode) return ComponentText.TransportMode.modes.unknown;
  if (!ComponentText.TransportMode.modes[mode.transportMode]) {
    return ComponentText.TransportMode.modes.unknown;
  }
  return ComponentText.TransportMode.modes[mode.transportMode];
}
export function severalTransportModesToTranslatedStrings(
  modes: TransportModeGroup[],
) {
  return modes
    .filter((mode) => !!mode.transportMode) // Remove the ! from mode.transportMode! below if this line is removed
    .map((mode) => ComponentText.TransportMode.modes[mode.transportMode!]);
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

export function isSubModeBoat(subModes?: TransportSubmodeType[]) {
  if (!subModes) return false;
  return subModes.some((subMode) => TRANSPORT_SUB_MODES_BOAT.includes(subMode));
}
