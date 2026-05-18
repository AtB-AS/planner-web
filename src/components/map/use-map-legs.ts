import { transportModeToColor } from '@atb/modules/transport-mode';
import { type MutableRefObject, useCallback, useEffect } from 'react';
import hexToRgba from 'hex-to-rgba';
import { ContrastColor, useTheme } from '@atb/modules/theme';
import { ComponentText, useTranslation } from '@atb/translations';
import type { MapLegType, PositionType } from './types';
import type { Map, AnySourceData, AnyLayer } from 'mapbox-gl';
import { addLayerIfNotExists, addSourceIfNotExists } from '.';

export const useMapLegs = (
  mapRef: MutableRefObject<Map | undefined>,
  mapLegs?: MapLegType[],
) => {
  const { t, language } = useTranslation();
  const {
    color: { transport, background },
  } = useTheme();

  const addToMap = useCallback(
    (map: Map, mapLeg: MapLegType, id: number) => {
      const transportColor = transportModeToColor(
        transport,
        mapLeg.faded ? 'unknown' : mapLeg.transportMode,
        mapLeg.transportSubmode,
        mapLeg.isFlexibleLine,
      );
      const lineColor = mapLeg.faded
        ? hexToRgba(transportColor.background, 0.5)
        : transportColor.background;
      const isDotted = mapLeg.transportMode === 'foot';

      const routeLine = createRouteFeature(mapLeg.points);
      const startEndCircles = createStartEndCircle(
        mapLeg.points[0],
        mapLeg.points[mapLeg.points.length - 1],
      );
      const routeLayer = createRouteLayer(id, lineColor, isDotted);
      const startEndLayer = createStartEndLayer(id, lineColor);

      addSourceIfNotExists(map, `route-${id}`, routeLine);
      addSourceIfNotExists(map, `route-${id}-start-end`, startEndCircles);

      addLayerIfNotExists(map, routeLayer);
      addLayerIfNotExists(map, startEndLayer);
    },
    [transport],
  );

  const addStartEndText = useCallback(
    (map: Map, startMapLeg: MapLegType, endMapLeg: MapLegType) => {
      const startTextSourceId = 'start-text';
      const endTextSourceId = 'end-text';
      const startTextPoint = createStartEndTextPoint(startMapLeg.points[0]);
      const startTextLayer = createStartEndTextLayer(
        startTextSourceId,
        t(ComponentText.Map.map.startPoint),
        background.accent[0],
      );
      const endTextPoint = createStartEndTextPoint(endMapLeg.points[0]);
      const endTextLayer = createStartEndTextLayer(
        endTextSourceId,
        t(ComponentText.Map.map.endPoint),
        background.accent[0],
      );

      addSourceIfNotExists(map, startTextSourceId, startTextPoint);
      addSourceIfNotExists(map, endTextSourceId, endTextPoint);

      addLayerIfNotExists(map, startTextLayer);
      addLayerIfNotExists(map, endTextLayer);
    },
    [background, t],
  );

  /**
   * Update the start and end text when the language changes
   */
  useEffect(() => {
    if (!mapRef || !mapRef.current) return;
    const map = mapRef.current;
    const startTextLayer = map.getLayer('start-text');
    const endTextLayer = map.getLayer('end-text');
    if (startTextLayer) {
      map.setLayoutProperty(
        'start-text',
        'text-field',
        t(ComponentText.Map.map.startPoint),
      );
    }
    if (endTextLayer) {
      map.setLayoutProperty(
        'end-text',
        'text-field',
        t(ComponentText.Map.map.endPoint),
      );
    }
  }, [language, mapRef, t]);

  useEffect(() => {
    if (!mapRef || !mapRef.current || !mapLegs) return;
    const map = mapRef.current;

    map.on('load', () => {
      mapLegs.forEach((mapLeg, index) => {
        if (mapLeg.points.length > 0) {
          addToMap(map, mapLeg, index);
        }
      });

      addStartEndText(map, mapLegs[0], mapLegs[mapLegs.length - 1]);
    });
  }, [mapRef, mapLegs, addToMap, addStartEndText]);
};

const createRouteFeature = (positions: PositionType[]): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: positions.map((pos) => [pos.lon, pos.lat]), // [longitude, latitude] because GeoJSON
    },
  },
});

const createRouteLayer = (
  id: number | string,
  color: string,
  isDotted?: boolean,
): AnyLayer => {
  let paint = {};
  let layout = {};

  if (isDotted) {
    paint = {
      'line-dasharray': [0, 2],
    };
    layout = {
      'line-cap': 'round',
      'line-join': 'round',
    };
  }

  return {
    id: `route-layer-${id}`,
    type: 'line',
    source: `route-${id}`,
    paint: {
      'line-color': color,
      'line-width': 4,
      'line-offset': -1,
      ...paint,
    },
    layout,
  };
};

const createStartEndCircle = (
  startPosition: PositionType,
  endPosition: PositionType,
): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [startPosition.lon, startPosition.lat], // [longitude, latitude] because GeoJSON
      },
      {
        type: 'Point',
        coordinates: [endPosition.lon, endPosition.lat], // [longitude, latitude] because GeoJSON
      },
    ],
  },
});

const createStartEndLayer = (id: number | string, color: string): AnyLayer => ({
  id: `route-layer-${id}-start-end`,
  type: 'circle',
  source: `route-${id}-start-end`,
  paint: {
    'circle-radius': 7.5,
    'circle-color': color,
  },
});

const createStartEndTextPoint = (position: PositionType): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [position.lon, position.lat], // [longitude, latitude] because GeoJSON
    },
  },
});

const createStartEndTextLayer = (
  source: string,
  textField: string,
  contrastColor: ContrastColor,
): AnyLayer => ({
  id: source,
  type: 'symbol',
  source: source,
  layout: {
    'text-field': textField,
    'text-justify': 'auto',
    'text-offset': [0, -1],
  },
  paint: {
    'text-color': contrastColor.foreground.primary,
    'text-halo-color': contrastColor.background,
    'text-halo-width': 2,
  },
});
