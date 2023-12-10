import type { ContrastColor } from '@atb-as/theme';
import { transportModeToColor } from '@atb/modules/transport-mode';
import { type MutableRefObject, useCallback, useEffect } from 'react';
import hexToRgba from 'hex-to-rgba';
import { useTheme } from '@atb/modules/theme';
import { ComponentText, useTranslation } from '@atb/translations';
import type { MapLegType } from './types';
import type { Map, AnySourceData, AnyLayer } from 'mapbox-gl';

export const useMapLegs = (
  mapRef: MutableRefObject<Map | undefined>,
  mapLegs?: MapLegType[],
) => {
  const { t, language } = useTranslation();
  const theme = useTheme();

  const addToMap = useCallback(
    (map: Map, mapLeg: MapLegType, id: number) => {
      const transportColor = transportModeToColor(
        {
          mode: mapLeg.faded ? 'unknown' : mapLeg.transportMode,
          subMode: mapLeg.transportSubmode,
        },
        theme,
      );
      const lineColor = mapLeg.faded
        ? hexToRgba(transportColor.background, 0.5)
        : transportColor.background;
      const isDotted = mapLeg.transportMode === 'foot';

      const routeLine = createRouteFeature(
        mapLeg.points.map((pair) => [...pair].reverse()),
      );
      const startEndCircles = createStartEndCircle(
        mapLeg.points[0],
        mapLeg.points[mapLeg.points.length - 1],
      );
      map.addSource(`route-${id}`, routeLine);
      map.addSource(`route-${id}-start-end`, startEndCircles);
      map.addLayer(createRouteLayer(id, lineColor, isDotted));
      map.addLayer(createStartEndLayer(id, lineColor));
    },
    [theme],
  );

  const addStartEndText = useCallback(
    (map: Map, startMapLeg: MapLegType, endMapLeg: MapLegType) => {
      const startTextSourceId = 'start-text';
      const endTextSourceId = 'end-text';
      const startTextPoint = createStartEndTextPoint(startMapLeg.points[0]);
      const startTextLayer = createStartEndTextLayer(
        startTextSourceId,
        t(ComponentText.Map.map.startPoint),
        theme.static.background.background_accent_0,
      );
      const endTextPoint = createStartEndTextPoint(endMapLeg.points[0]);
      const endTextLayer = createStartEndTextLayer(
        endTextSourceId,
        t(ComponentText.Map.map.endPoint),
        theme.static.background.background_accent_0,
      );

      map.addSource(startTextSourceId, startTextPoint);
      map.addSource(endTextSourceId, endTextPoint);
      map.addLayer(startTextLayer);
      map.addLayer(endTextLayer);
    },
    [theme, t],
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

const createRouteFeature = (points: number[][]): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: points,
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
  startPoint: number[],
  endPoint: number[],
): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'GeometryCollection',
    geometries: [
      {
        type: 'Point',
        coordinates: [startPoint[1], startPoint[0]],
      },
      {
        type: 'Point',
        coordinates: [endPoint[1], endPoint[0]],
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

const createStartEndTextPoint = (point: number[]): AnySourceData => ({
  type: 'geojson',
  data: {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [point[1], point[0]],
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
    'text-color': contrastColor.text,
    'text-halo-color': contrastColor.background,
    'text-halo-width': 2,
  },
});
