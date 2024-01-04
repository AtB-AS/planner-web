import { useCallback, useEffect, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import mapboxgl from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/turf';
import { type TariffZone, getTariffZones } from '@atb/modules/firebase';
import useSWR from 'swr';

const TARIFF_ZONE_SOURCE_ID = 'tariff-zones';
const ZONE_BOUNDARY_LAYER_ID = 'zone-boundary-layer';
const ZONE_NAMES_LAYER_ID = 'zone-names-layer';

export const useMapTariffZones = async (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) => {
  const { language } = useTranslation();
  const [isZonesVisible, setIsZonesVisible] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { data } = useSWR('tariffZones', getTariffZones, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const addTariffZonesToMap = useCallback(
    (map: mapboxgl.Map) => {
      if (!data || !isStyleLoaded) return;
      if (!map.getSource(TARIFF_ZONE_SOURCE_ID)) {
        map.addSource(
          TARIFF_ZONE_SOURCE_ID,
          createTariffZonesFeatureCollection(data, language),
        );
      }

      if (!map.getLayer(ZONE_BOUNDARY_LAYER_ID)) {
        map.addLayer({
          id: ZONE_BOUNDARY_LAYER_ID,
          type: 'line',
          source: TARIFF_ZONE_SOURCE_ID,
          paint: {
            'line-width': 1,
            'line-color': '#666666',
          },
        });
      }

      if (!map.getLayer(ZONE_NAMES_LAYER_ID)) {
        map.addLayer({
          id: ZONE_NAMES_LAYER_ID,
          type: 'symbol',
          source: TARIFF_ZONE_SOURCE_ID,
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

      setIsZonesVisible(true);
    },
    [language, data, isStyleLoaded],
  );

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.on('style.load', () => setIsStyleLoaded(true));

    // If the map is already loaded, call the handler manually
    if (mapRef.current.isStyleLoaded()) setIsStyleLoaded(true);

    return () => {
      setIsStyleLoaded(false);
    };
  }, [setIsStyleLoaded, mapRef]);

  useEffect(() => {
    if (isZonesVisible || !data || !mapRef.current || !isStyleLoaded) {
      return;
    }
    addTariffZonesToMap(mapRef.current);
  }, [addTariffZonesToMap, data, isZonesVisible, mapRef, isStyleLoaded]);
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
