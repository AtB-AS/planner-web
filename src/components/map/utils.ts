import {
  MapboxGeoJSONFeature,
  type Map,
  AnySourceData,
  AnyLayer,
} from 'mapbox-gl';
import { mapboxData } from '@atb/modules/org-data';
import { MapLegType, Position } from './types';
import haversineDistance from 'haversine-distance';
import { PointsOnLink as GraphQlPointsOnLink } from '@atb/modules/graphql-types';
import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/modules/transport-mode';
import polyline from '@mapbox/polyline';
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

export const isFeaturePoint = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.geometry.type === 'Point';

export const isStopPlace = (
  f: MapboxGeoJSONFeature,
): f is MapboxGeoJSONFeature => f.properties?.entityType == 'StopPlace';

export const mapToMapLegs = (
  pointsOnLink: GraphQlPointsOnLink | undefined,
  transportMode: TransportModeType,
  transportSubmode: TransportSubmodeType | undefined,
  fromStopPlace?: { latitude?: number; longitude?: number },
  toStopPlace?: { latitude?: number; longitude?: number },
  isFlexibleLine?: boolean,
) => {
  if (!pointsOnLink || !pointsOnLink.points) return [];
  const points = polyline.decode(pointsOnLink.points);
  const fromCoordinates: [number, number] = [
    fromStopPlace?.latitude ?? 0,
    fromStopPlace?.longitude ?? 0,
  ];
  const toCoordinates: [number, number] | undefined = toStopPlace
    ? [toStopPlace?.latitude ?? 0, toStopPlace?.longitude ?? 0]
    : undefined;

  const mainStartIndex = findIndex(points, fromCoordinates);
  const mainEndIndex = toCoordinates
    ? findIndex(points, toCoordinates)
    : points.length - 1;

  const beforeLegCoords = points.slice(0, mainStartIndex + 1);
  const mainLegCoords = points.slice(mainStartIndex, mainEndIndex + 1);
  const afterLegCoords = points.slice(mainEndIndex);

  const toMapLeg = (item: [number, number][], faded: boolean) => {
    return {
      transportMode,
      transportSubmode,
      faded,
      points: item,
      isFlexibleLine: isFlexibleLine ?? false,
    };
  };

  const mapLegs: MapLegType[] = [
    toMapLeg(beforeLegCoords, true),
    toMapLeg(mainLegCoords, false),
    toMapLeg(afterLegCoords, true),
  ];

  return mapLegs;
};

const findIndex = (
  array: [number, number][],
  quayCoords: [number, number],
): number => {
  return array.reduce(
    (closest, t, index) => {
      const distance = haversineDistance(t, quayCoords);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: -1, distance: 100 },
  ).index;
};

export const getMapBounds = (
  mapLegs: MapLegType[],
): [[number, number], [number, number]] => {
  const lineLongitudes = mapLegs
    .map((leg) => leg.points.map((point) => point[0]))
    .flat();
  const lineLatitudes = mapLegs
    .map((leg) => leg.points.map((point) => point[1]))
    .flat();

  const westernMost = Math.min(...lineLongitudes);
  const easternMost = Math.max(...lineLongitudes);
  const northernMost = Math.max(...lineLatitudes);
  const southernMost = Math.min(...lineLatitudes);

  // Dividing by 3 here is arbitrary, seems to work
  // like a fine value for "padding"
  const latPadding = (northernMost - southernMost) / 3;
  const lonPadding = (westernMost - easternMost) / 3;

  const sw: [number, number] = [
    southernMost - latPadding,
    westernMost + lonPadding,
  ];
  const ne: [number, number] = [
    northernMost + latPadding,
    easternMost - lonPadding,
  ];

  return [sw, ne];
};

export function addSourceIfNotExists(
  map: Map,
  sourceId: string,
  source: AnySourceData,
) {
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, source);
  }
}

export function addLayerIfNotExists(map: Map, layer: AnyLayer) {
  if (!map.getLayer(layer.id)) {
    map.addLayer(layer);
  }
}
