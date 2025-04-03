import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { TransportModeType } from '@atb/modules/transport-mode';

export type Position = {
  lon: number;
  lat: number;
};

export type MapLegType = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmode;
  faded: boolean;
  points: Position[];
  isFlexibleLine: boolean;
};
