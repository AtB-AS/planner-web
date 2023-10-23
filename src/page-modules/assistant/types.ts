import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { GeocoderFeature } from '@atb/page-modules/departures';

export type TripInput = {
  from: GeocoderFeature;
  to: GeocoderFeature;
  arriveBy: boolean;
  when: Date;
  transportModes: TransportModeFilterOption[] | null;
};
