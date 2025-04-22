import { genericError, HttpRequester } from '@atb/modules/api-server';
import type { GeocoderFeature } from '../../types';
import { GeocoderRoot, geocoderRootSchema } from './encoders';
import { FeatureCategory } from '@atb/components/venue-icon';
import { first } from 'lodash';
import { getDefaultFocusPoint } from '@atb/modules/firebase/default-focus-point';
import { getDefaultPosition } from '@atb/modules/position/utils.ts';

const FOCUS_WEIGHT = 18;

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
      const focusQuery = await createFocusQuery(focus);
      const result = await request(
        `/geocoder/v1/autocomplete?text=${query}&${focusQuery}&size=10&lang=no&multiModal=child`,
      );
      const jsRes = await result.json();
      console.log('Unparsed result: ' + JSON.stringify(jsRes, null, 2));

      const parsed = geocoderRootSchema.safeParse(jsRes);

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

async function createFocusQuery(focus?: {
  lat: number;
  lon: number;
}): Promise<string> {
  const defaultFocusPoint = await getDefaultPosition();
  const { lat, lon } = focus ?? defaultFocusPoint;
  return `focus.point.lat=${lat}&focus.point.lon=${lon}&focus.weight=${FOCUS_WEIGHT}&focus.function=exp&focus.scale=200km`;
}

function mapGeocoderFeature(data: GeocoderRoot) {
  return data.features.map((f) => ({
    id: f.properties.id,
    name: f.properties.name,
    locality: f.properties.locality ?? null,
    category: f.properties.category as FeatureCategory[],
    layer: f.properties.layer,
    geometry: f.geometry,
  }));
}
