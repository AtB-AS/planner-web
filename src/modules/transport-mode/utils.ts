import { ComponentText } from '@atb/translations';
import {
  transportModeSchema,
  TransportModeType,
  transportSubmodeSchema,
} from './types';
import { TransportMode as GraphQlTransportMode } from '@atb/modules/graphql-types';
import {
  TransportSubmodeType,
  TransportModeType as NewTransportModeType,
} from '@atb-as/config-specs';

export function transportModeToTranslatedString(
  transportMode?: NewTransportModeType,
) {
  const text =
    transportMode && ComponentText.TransportMode.modes[transportMode];
  if (!text) {
    return ComponentText.TransportMode.modes.unknown;
  }
  return text;
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

export function isSubModeBoat(subMode?: TransportSubmodeType) {
  return subMode && TRANSPORT_SUB_MODES_BOAT.includes(subMode);
}
