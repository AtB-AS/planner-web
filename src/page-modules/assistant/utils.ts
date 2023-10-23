import { GeocoderFeature } from '@atb/page-modules/departures';

export type FromToQuery = {
  fromId: string;
  fromName: string;
  fromLon: string;
  fromLat: string;
  fromLayer: string;
  toId: string;
  toName: string;
  toLon: string;
  toLat: string;
  toLayer: string;
};

export const featuresToFromToQuery = (
  from: GeocoderFeature | undefined,
  to: GeocoderFeature | undefined,
): FromToQuery | null => {
  if (!from || !to) return null;
  return {
    fromId: from.id,
    fromName: from.name,
    fromLon: from.geometry.coordinates[0].toString(),
    fromLat: from.geometry.coordinates[1].toString(),
    fromLayer: from.layer,
    toId: to.id,
    toName: to.name,
    toLon: to.geometry.coordinates[0].toString(),
    toLat: to.geometry.coordinates[1].toString(),
    toLayer: to.layer,
  };
};

export const parseLayerQueryString = (layer: string): 'address' | 'venue' => {
  if (layer === 'venue') return 'venue';
  return 'address';
};
