import { genericError, HttpRequester } from '@atb/modules/api-server';
import type { GeocoderFeature } from '../../types';
import { GeocoderRoot, geocoderRootSchema } from './encoders';
import { FeatureCategory } from '@atb/components/venue-icon';
import { first } from 'lodash';

const FOCUS_WEIGHT = 18;
const DEFAULT_FOCUS_POINT = { lat: 63.4305, lon: 10.39518 }; // TODO: Replace with configuration.

export type GeocoderApi = {
  autocomplete(
    query: string,
    focus?: {
      lat: number;
      lon: number;
    },
  ): Promise<GeocoderFeature[]>;
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
    async autocomplete(query, focus) {
      const focusQuery = createFocusQuery(focus);
      const result = await request(
        `/geocoder/v1/autocomplete?text=${query}&${focusQuery}&size=10&lang=no`,
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

function createFocusQuery(focus?: { lat: number; lon: number }): string {
  const { lat, lon } = focus ?? DEFAULT_FOCUS_POINT;
  return `focus.point.lat=${lat}&focus.point.lon=${lon}&focus.weight=${FOCUS_WEIGHT}&focus.function=exp&focus.scale=200km`;
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
