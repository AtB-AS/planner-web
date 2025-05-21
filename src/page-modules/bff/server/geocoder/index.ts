import { HttpRequester, genericError } from '@atb/modules/api-server';
import { first } from 'lodash';
import { Feature, FeatureCategory } from '../../../../modules/geocoder/types';
import { GeocoderFeature } from '@atb/page-modules/departures';

export type BffGeocoderApi = {
  autocomplete(query: string): Promise<GeocoderFeature[]>;
  reverse(query: string): Promise<GeocoderFeature | undefined>;
};

export function createBffGeocoderApi(
  request: HttpRequester<'http-bff'>,
): BffGeocoderApi {
  return {
    async autocomplete(query) {
      const url = '/v1/geocoder/features';
      const result = await request(`${url}?${query}`);

      try {
        return mapGeocoderFeatures(await result.json());
      } catch {
        throw genericError();
      }
    },

    async reverse(query) {
      const url = '/v1/geocoder/reverse';
      const result = await request(`${url}?${query}`);

      try {
        // Only return the first feature
        return first(mapGeocoderFeatures(await result.json()));
      } catch (error) {
        throw genericError();
      }
    },
  };
}

function mapGeocoderFeatures(data: Feature[]): GeocoderFeature[] {
  return data.map((f) => ({
    id: f.properties.id,
    name: f.properties.name,
    locality: f.properties.locality ?? null,
    category: f.properties.category as FeatureCategory[],
    layer: f.properties.layer,
    geometry: f.geometry,
    street: f.properties.street,
  }));
}
