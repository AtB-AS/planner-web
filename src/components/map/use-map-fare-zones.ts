import { useCallback, useEffect, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import { LayerSpecification } from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/centroid';
import { type FareZone, getFareZones } from '@atb/modules/firebase';
import { addLayerIfNotExists, addSourceIfNotExists } from '.';
import useSWRImmutable from 'swr/immutable';

const FARE_ZONE_SOURCE_ID = 'fare-zones';
const ZONE_BOUNDARY_LAYER_ID = 'zone-boundary-layer';
const ZONE_NAMES_LAYER_ID = 'zone-names-layer';

export const useMapFareZones = (
  mapRef: React.RefObject<mapboxgl.Map | undefined>,
) => {
  const { language } = useTranslation();
  const [isZonesVisible, setIsZonesVisible] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { data } = useSWRImmutable('fareZones', getFareZones);

  const addFareZonesToMap = useCallback(
    (map: mapboxgl.Map) => {
      if (!data || !isStyleLoaded) return;
      addSourceIfNotExists(
        map,
        FARE_ZONE_SOURCE_ID,
        createFareZonesFeatureCollection(data, language),
      );

      const zoneBoundaryLayer: LayerSpecification = {
        id: ZONE_BOUNDARY_LAYER_ID,
        type: 'line',
        source: FARE_ZONE_SOURCE_ID,
        paint: {
          'line-width': 1,
          'line-color': '#666666',
        },
      };

      addLayerIfNotExists(map, zoneBoundaryLayer);

      const zoneNamesLayer: LayerSpecification = {
        id: ZONE_NAMES_LAYER_ID,
        type: 'symbol',
        source: FARE_ZONE_SOURCE_ID,
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
      };

      addLayerIfNotExists(map, zoneNamesLayer);

      setIsZonesVisible(true);
    },
    [language, data, isStyleLoaded],
  );

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleStyleLoad = () => setIsStyleLoaded(true);
    map.on('style.load', handleStyleLoad);

    // If the map is already loaded, call the handler manually
    if (map.isStyleLoaded()) setIsStyleLoaded(true);

    return () => {
      map.off('style.load', handleStyleLoad);
      setIsStyleLoaded(false);
    };
  }, [setIsStyleLoaded, mapRef]);

  useEffect(() => {
    if (isZonesVisible || !data || !mapRef.current || !isStyleLoaded) {
      return;
    }
    addFareZonesToMap(mapRef.current);
  }, [addFareZonesToMap, data, isZonesVisible, mapRef, isStyleLoaded]);
};

const createFareZonesFeatureCollection = (
  fareZones: FareZone[],
  language: Language,
) => ({
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: fareZones
      .map((fareZone) => [
        {
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Polygon' as const,
            coordinates: fareZone.geometry.coordinates,
          },
        },
        {
          type: 'Feature' as const,
          properties: {
            name: getReferenceDataName(fareZone, language),
            middlePoint: centroid(fareZone.geometry),
          },
          geometry: {
            type: 'Point' as const,
            coordinates:
              centroid(fareZone.geometry)?.geometry?.coordinates ?? [],
          },
        },
      ])
      .flat(),
  },
});
