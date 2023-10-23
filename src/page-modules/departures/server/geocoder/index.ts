import { genericError, HttpRequester } from '@atb/modules/api-server';
import type { GeocoderFeature } from '../../types';
import { GeocoderRoot, geocoderRootSchema } from './encoders';
import { FeatureCategory } from '@atb/components/venue-icon';
import { first } from 'lodash';

export type GeocoderApi = {
  autocomplete(query: string): Promise<GeocoderFeature[]>;
  reverse(
    lat: number,
    lon: number,
    layers: 'address' | 'venue',
  ): Promise<GeocoderFeature | undefined>;
};

export function createGeocoderApi(
  request: HttpRequester<'http-entur'>,
): GeocoderApi {
  return {
    async autocomplete(query) {
      const result = await request(
        `/geocoder/v1/autocomplete?text=${query}&size=20&lang=no`,
      );

      const parsed = geocoderRootSchema.safeParse(await result.json());

      if (!parsed.success) {
        throw genericError();
      }

      return mapGeocoderFeature(parsed.data);
    },

    async reverse(lat, lon, layers) {
      const result = await request(
        `/geocoder/v1/reverse?point.lat=${lat}&point.lon=${lon}&size=1&layers=${layers}&lang=no`,
      );

      const parsed = geocoderRootSchema.safeParse(await result.json());

      if (!parsed.success) {
        throw genericError();
      }

      return first(mapGeocoderFeature(parsed.data));
    },
  };
}

function mapGeocoderFeature(data: GeocoderRoot) {
  return data.features.map((f) => ({
    id: f.properties.id,
    name: f.properties.name,
    locality: f.properties.locality,
    category: f.properties.category as FeatureCategory[],
    layer: f.properties.layer,
    geometry: f.geometry,
  }));
}
