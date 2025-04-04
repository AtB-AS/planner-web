import {
  AnyLayer,
  AnySourceData,
  type Map,
  AnyLayer,
  AnySourceData,
  type Map,
  MapboxGeoJSONFeature,
} from 'mapbox-gl';
import { mapboxData } from '@atb/modules/org-data';
import { MapLegType, PositionType } from './types';
import { MapLegType, PositionType } from './types';
import haversineDistance from 'haversine-distance';
import { PointsOnLink as GraphQlPointsOnLink } from '@atb/modules/graphql-types';
import polyline from '@mapbox/polyline';
import { TransportSubmode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import { TransportModeType } from '@atb/modules/transport-mode';


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

export const defaultPosition: PositionType = {
export const defaultPosition: PositionType = {
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
  transportSubmode: TransportSubmode | undefined,
  fromStopPlace?: { latitude?: number; longitude?: number },
  toStopPlace?: { latitude?: number; longitude?: number },
  isFlexibleLine?: boolean,
) => {
  if (!pointsOnLink || !pointsOnLink.points) {
    return [];
  }
  const points = polyline
    .decode(pointsOnLink.points)
    .map((points) => ({ lat: points[0], lon: points[1] }));
  const fromCoordinates: PositionType = {
    lat: fromStopPlace?.latitude ?? defaultPosition.lat,
    lon: fromStopPlace?.longitude ?? defaultPosition.lon,
  };

  const toCoordinates: PositionType | undefined =
    toStopPlace?.latitude && toStopPlace?.longitude
      ? { lat: toStopPlace.latitude, lon: toStopPlace.longitude }
      : undefined;
  const mainStartIndex = findIndex(points, fromCoordinates);
  const mainEndIndex = toCoordinates
    ? findIndex(points, toCoordinates)
    : points.length - 1;
  const beforeLegCoords = points.slice(0, mainStartIndex + 1);
  const mainLegCoords = points.slice(mainStartIndex, mainEndIndex + 1);
  const afterLegCoords = points.slice(mainEndIndex);

  const toMapLeg = (item: PositionType[], faded: boolean) => {
  const toMapLeg = (item: PositionType[], faded: boolean) => {
    return {
      transportMode,
      transportSubmode,
      faded,
      points: item,
      isFlexibleLine: isFlexibleLine ?? false,
    };
  };

  const mapLegs: MapLegType[] = [
    toMapLeg(beforeLegPositions, true),
    toMapLeg(mainLegPositions, false),
    toMapLeg(afterLegPositions, true),
  ];

  return mapLegs;
};

const findIndex = (
  positions: PositionType[],
  quayPosition: PositionType,
  positions: PositionType[],
  quayPosition: PositionType,
): number => {
  return positions.reduce(
  return positions.reduce(
    (closest, t, index) => {
      const distance = haversineDistance(t, quayPosition);
      const distance = haversineDistance(t, quayPosition);
      return distance < closest.distance ? { index, distance } : closest;
    },
    { index: -1, distance: 100 },
  ).index;
};

export const getMapBounds = (
  mapLegs: MapLegType[],
): [[number, number], [number, number]] => {
  const lineLongitudes = mapLegs
    .map((leg) => leg.points.map((point) => point.lon))
    .flat();

  const westernMost = Math.min(...lineLatitudes);
  const easternMost = Math.max(...lineLatitudes);
  const northernMost = Math.max(...lineLongitudes);
  const southernMost = Math.min(...lineLongitudes);

  // Dividing by 3 here is arbitrary, seems to work
  // like a fine value for "padding"
  const lonPadding = (northernMost - southernMost) / 3;
  const latPadding = (westernMost - easternMost) / 3;

  const sw: PositionType = {
    lat: southernMost - latPadding,
    lon: westernMost + lonPadding,
  };
  const ne: PositionType = {
    lat: northernMost + latPadding,
    lon: easternMost - lonPadding,
  };

  return [
    [sw.lon, sw.lat],
    [ne.lon, ne.lat],
  ];
  return [
    [sw.lon, sw.lat],
    [ne.lon, ne.lat],
  ];
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

export function hasInitialPosition(
  a: any,
): a is { position: PositionType; initialZoom?: number } {
): a is { position: PositionType; initialZoom?: number } {
  return !!a.position;
}

export function hasMapLegs(a: any): a is { mapLegs: MapLegType[] } {
  return a.mapLegs?.length > 0;
}
