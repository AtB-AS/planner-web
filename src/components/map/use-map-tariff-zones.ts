import { useCallback, useEffect } from 'react';
import { Language, useTranslation } from '@atb/translations';
import mapboxgl from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/turf';
import { type TariffZone, getTariffZones } from '@atb/modules/firebase';
import useSWR from 'swr';

export const useMapTariffZones = async (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) => {
  const { language } = useTranslation();
  /**
   * @TODO: Caching is not working as expected so we'll have to look into improving this.
   */
  const { data, error } = useSWR('tariffZones', getTariffZones, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const addTariffZonesToMap = useCallback(
    (map: mapboxgl.Map) => {
      if (!data) return;
      if (!map.getSource('tariff-zones')) {
        map.addSource(
          'tariff-zones',
          createTariffZonesFeatureCollection(data, language),
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
    [language, data],
  );

  useEffect(() => {
    if (!mapRef || !mapRef.current || error) return;
    const map = mapRef.current;

    if (map.loaded()) {
      addTariffZonesToMap(map);
    }

    map.on('load', () => {
      addTariffZonesToMap(map);
    });
  }, [mapRef, error, language, addTariffZonesToMap]);
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
