import { MapboxGeoJSONFeature } from 'mapbox-gl';
import { mapboxData } from '@atb/modules/org-data';

export const ZOOM_LEVEL = 16.5;
export const INTERACTIVE_LAYERS = [
  'airport.nsr.api',
  'boat.nsr.api',
  'bus.nsr.api',
  'bus.tram.nsr.api',
  'bussterminal.nsr.api',
  'ferjekai.nsr.api',
  'metro.nsr.api',
  'metro.tram.nsr.api',
  'railway.nsr.api',
  'tram.nsr.api',
];

export const defaultPosition: Position = {
  lon: mapboxData.defaultLng,
  lat: mapboxData.defaultLat,
};

export type Position = {
  lon: number;
  lat: number;
};

export const isFeaturePoint = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.geometry.type === 'Point';

export const isStopPlace = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.properties?.entityType == 'StopPlace';
