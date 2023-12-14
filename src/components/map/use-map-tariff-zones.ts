import { useCallback, useEffect, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import { TariffZone } from '@atb/modules/firebase/types';
import mapboxgl from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/turf';

export const useMapTariffZones = async (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  tariffZones: TariffZone[],
) => {
  const { language } = useTranslation();

  const addTariffZonesToMap = useCallback(
    (map: mapboxgl.Map) => {
      if (!map.getSource('tariff-zones')) {
        map.addSource(
          'tariff-zones',
          createTariffZonesFeatureCollection(tariffZones, language),
        );
      }

      if (!map.getLayer('zone-boundary-layer')) {
        map.addLayer({
          id: 'zone-boundary-layer',
          type: 'line',
          source: 'tariff-zones',
          paint: {
            'line-width': 1,
            'line-color': '#666666',
          },
        });
      }

      if (!map.getLayer('zone-names-layer')) {
        map.addLayer({
          id: 'zone-names-layer',
          type: 'symbol',
          source: 'tariff-zones',
          layout: {
            'text-field': ['get', 'name'],
            'text-justify': 'auto',
            'text-offset': [0, 0],
          },
          paint: {
            'text-color': '#000000',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 2,
          },
          filter: ['==', '$type', 'Point'],
        });
      }
    },
    [language, tariffZones],
  );

  useEffect(() => {
    if (!mapRef || !mapRef.current || !tariffZones.length) return;
    const map = mapRef.current;

    if (map.loaded()) {
      addTariffZonesToMap(map);
    }

    map.once('load', () => {
      addTariffZonesToMap(map);
    });

    map.on('load', () => {
      addTariffZonesToMap(map);
    });
  }, [mapRef, tariffZones, language, addTariffZonesToMap]);
};

const createTariffZonesFeatureCollection = (
  tariffZones: TariffZone[],
  language: Language,
) => ({
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: tariffZones
      .map((tariffZone) => [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: tariffZone.geometry.coordinates,
          },
        },
        {
          type: 'Feature' as const,
          properties: {
            name: getReferenceDataName(tariffZone, language),
            middlePoint: centroid(tariffZone.geometry),
          },
          geometry: {
            type: 'Point' as const,
            coordinates:
              centroid(tariffZone.geometry)?.geometry?.coordinates ?? [],
          },
        },
      ])
      .flat(),
  },
});
