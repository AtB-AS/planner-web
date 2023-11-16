import { Theme } from '@atb-as/theme';
import { transportModeToColor } from '@atb/modules/transport-mode';
import { MapLegType } from '@atb/page-modules/departures';
import { useCallback, useEffect } from 'react';
import hexToRgba from 'hex-to-rgba';

export const useMapLegs = (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  transport: Theme['transport'],
  mapLegs?: MapLegType[],
) => {
  const addToMap = useCallback(
    (map: mapboxgl.Map, mapLeg: MapLegType, id: number) => {
      const transportColor = transportModeToColor(
        {
          mode: mapLeg.faded ? 'unknown' : mapLeg.transportMode,
          subMode: mapLeg.transportSubmode,
        },
        transport,
      );
      const lineColor = mapLeg.faded
        ? hexToRgba(transportColor.background, 0.5)
        : transportColor.background;

      const routeLine = createRouteFeature(
        mapLeg.points.map((pair) => [...pair].reverse()),
      );
      const startEndCircles = createStartEndCircle(
        mapLeg.points[0],
        mapLeg.points[mapLeg.points.length - 1],
      );
      map.addSource(`route-${id}`, routeLine);
      map.addSource(`route-${id}-start-end`, startEndCircles);
      map.addLayer(createRouteLayer(id, lineColor));
      map.addLayer(createStartEndLayer(id, lineColor));
    },
    [transport],
  );

  useEffect(() => {
    if (!mapRef || !mapRef.current || !mapLegs) return;
    const map = mapRef.current;

    map.on('load', () => {
      mapLegs.forEach((mapLeg, index) => {
        if (mapLeg.points.length > 0) {
          addToMap(map, mapLeg, index);
        }
      });
    });
  }, [mapRef, mapLegs, addToMap]);
};

const createRouteFeature = (points: number[][]): mapboxgl.AnySourceData => ({
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
): mapboxgl.AnyLayer => ({
  id: `route-layer-${id}`,
  type: 'line',
  source: `route-${id}`,
  paint: {
    'line-color': color,
    'line-width': 4,
    'line-offset': -1,
  },
});

const createStartEndCircle = (
  startPoint: number[],
  endPoint: number[],
): mapboxgl.AnySourceData => ({
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

const createStartEndLayer = (
  id: number | string,
  color: string,
): mapboxgl.AnyLayer => ({
  id: `route-layer-${id}-start-end`,
  type: 'circle',
  source: `route-${id}-start-end`,
  paint: {
    'circle-radius': 7.5,
    'circle-color': color,
  },
});
