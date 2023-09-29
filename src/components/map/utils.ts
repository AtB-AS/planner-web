import { MapboxGeoJSONFeature } from 'mapbox-gl';

export const isFeaturePoint = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.geometry.type === 'Point';

export const isStopPlace = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.properties?.entityType == 'StopPlace';
