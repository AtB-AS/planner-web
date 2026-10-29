import { HttpRequester, genericError } from '@atb/modules/api-server';
import { first } from 'lodash';
import {
  Feature,
  FeatureCategory,
  GeocoderLayer,
} from '../../../../modules/geocoder/types';
import { GeocoderFeature } from '@atb/modules/geocoder';
import qs from 'query-string';

export type BffGeocoderApi = {
  autocomplete(
    query: string,
    options?: {
      lat?: string | number;
      lon?: string | number;
      layers?: GeocoderLayer[];
    },
  ): Promise<GeocoderFeature[]>;
  reverse(
    lat: number | string,
    lon: number | string,
    layers: GeocoderLayer[],
  ): Promise<GeocoderFeature | undefined>;
};

export function createBffGeocoderApi(
  request: HttpRequester<'http-bff'>,
): BffGeocoderApi {
  return {
    async autocomplete(query, options) {
      const url = '/v2/geocoder/features';

      const queryObject = {
        query,
        ...options,
        limit: 10,
        multimodal: 'parent', // This is set to the same as in the app.
      };
      const result = await request(
        `${url}?${qs.stringify(queryObject, { skipNull: true })}`,
      );

      return mapGeocoderFeatures(await result.json());
    },

    async reverse(lat, lon, layers) {
      const url = '/v2/geocoder/reverse';

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

const featureCategories = new Set<string>(Object.values(FeatureCategory));

// Maps geocoder v3 features to the v1 shape that the rest of the app (and the
// externally embedded widget) expects. Matches the mapping in the app.
function mapGeocoderFeatures(data: Feature[]): GeocoderFeature[] {
  return data.map(({ geometry, properties }) => ({
    id: properties.id,
    name: properties.names.default,
    locality: properties.address?.locality ?? null,
    category: (properties.stopPlaceTypes ?? []).filter(
      (t): t is FeatureCategory => featureCategories.has(t),
    ),
    layer: properties.layer === 'stopPlace' ? 'venue' : 'address',
    geometry,
    street: properties.address?.streetName ?? null,
    housenumber: properties.address?.houseNumber ?? null,
  }));
}
