import { genericError, HttpRequester } from '@atb/modules/api-server';
import type { GeocoderFeature } from '../../types';
import { GeocoderRoot, geocoderRootSchema } from './encoders';
import { FeatureCategory } from '@atb/components/venue-icon';
import { first } from 'lodash';
import { mapboxData } from '@atb/modules/org-data';

const FOCUS_WEIGHT = 18;

export type GeocoderApi = {
  autocomplete(
    query: string,
    focus?: {
      lat: number;
      lon: number;
    },
    onlyStopPlaces?: boolean,
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
    async autocomplete(query, focus, onlyStopPlaces) {
      const focusQuery = createFocusQuery(focus);
      const venueQuery = onlyStopPlaces ? ['venue'] : ['venue', 'address'];
      const result = await request(
        `/geocoder/v1/autocomplete?text=${query}&${focusQuery}&size=10&lang=no&multiModal=child&layers=${venueQuery}`,
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
  const defaultCoordinates = {
    lat: mapboxData.defaultLat,
    lon: mapboxData.defaultLng,
  };

  const { lat, lon } = focus ?? defaultCoordinates;

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
