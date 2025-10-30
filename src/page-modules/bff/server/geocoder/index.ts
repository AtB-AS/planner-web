import { HttpRequester, genericError } from '@atb/modules/api-server';
import { first } from 'lodash';
import { Feature, FeatureCategory } from '../../../../modules/geocoder/types';
import { GeocoderFeature } from '@atb/modules/geocoder';
import qs from 'query-string';

export type BffGeocoderApi = {
  autocomplete(
    query: string,
    options?: {
      lat?: string | number;
      lon?: string | number;
      layers?: string[];
    },
  ): Promise<GeocoderFeature[]>;
  reverse(
    lat: number | string,
    lon: number | string,
    layers: string[],
  ): Promise<GeocoderFeature | undefined>;
};

export function createBffGeocoderApi(
  request: HttpRequester<'http-bff'>,
): BffGeocoderApi {
  return {
    async autocomplete(query, options) {
      const url = '/v1/geocoder/features';

      const queryObject = {
        query,
        ...options,
        limit: 10,
        multiModal: 'parent', // This is set to the same as in the app.
      };
      const result = await request(
        `${url}?${qs.stringify(queryObject, { skipNull: true })}`,
      );

      return mapGeocoderFeatures(await result.json());
    },

    async reverse(lat, lon, layers) {
      const url = '/v1/geocoder/reverse';

      const query = {
        lat: lat,
        lon: lon,
        layers,
        limit: 1,
      };

      const result = await request(`${url}?${qs.stringify(query)}`);

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
