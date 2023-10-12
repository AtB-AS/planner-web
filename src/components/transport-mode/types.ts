import { TransportModeType, TransportSubmodeType } from '@atb-as/config-specs';

export type TransportModeGroup = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};
