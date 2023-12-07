import { useCallback, useEffect, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import { TariffZone } from '@atb/modules/firebase/types';
import mapboxgl from 'mapbox-gl';
import getTariffZones from '@atb/modules/firebase';
import { getReferenceDataName } from '@atb/utils/reference-data';
import turfCentroid from '@turf/centroid';

export const useMapTariffZones = async (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) => {
  const { language } = useTranslation();
  const [tariffZones, setTariffZones] = useState<TariffZone[]>([]);

  useEffect(() => {
    const fetchTariffZones = async () => {
      const zones = await getTariffZones();
      setTariffZones(zones);
    };

    fetchTariffZones();
  }, []);

  const addTariffZonesToMap = useCallback(
    (map: mapboxgl.Map) => {
      if (map.getSource('tariff-zones')) return;

      map.addSource(
        'tariff-zones',
        createTariffZonesFeatureCollection(tariffZones, language),
      );

      map.addLayer({
        id: 'zone-boundary-layer',
        type: 'line',
        source: 'tariff-zones',
        paint: {
          'line-width': 1,
          'line-color': '#666666',
        },
      });

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
    },
    [language, tariffZones],
  );

  useEffect(() => {
    if (!mapRef || !mapRef.current || !tariffZones.length) return;
    const map = mapRef.current;

    // Map might be loaded before tariff zones are fetched
    map.loaded() && !map.getSource('tariff-zones') && addTariffZonesToMap(map);

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
            middlePoint: turfCentroid(tariffZone.geometry),
          },
          geometry: {
            type: 'Point' as const,
            coordinates: turfCentroid(tariffZone.geometry).geometry.coordinates,
          },
        },
      ])
      .flat(),
  },
});
