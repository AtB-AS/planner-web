import { useCallback, useEffect, useRef, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import { LayerSpecification, type LngLatBoundsLike } from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/centroid';
import { type FareZone } from '@atb/modules/firebase';
import { swrFetcher } from '@atb/modules/api-browser';
import { addLayerIfNotExists, addSourceIfNotExists } from '.';
import useSWRImmutable from 'swr/immutable';

const FARE_ZONE_SOURCE_ID = 'fare-zones';
const ZONE_BOUNDARY_LAYER_ID = 'zone-boundary-layer';
const ZONE_NAMES_LAYER_ID = 'zone-names-layer';

export const useMapFareZones = (
  mapRef: React.RefObject<mapboxgl.Map | undefined>,
  { fitOnLoad = false }: { fitOnLoad?: boolean } = {},
) => {
  const { language } = useTranslation();
  const [isZonesVisible, setIsZonesVisible] = useState(false);
  const hasFittedOnLoad = useRef(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { data } = useSWRImmutable<FareZone[]>(
    '/api/config/fare-zones',
    swrFetcher,
  );

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
          'line-width': 2,
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

  const fitToFareZones = useCallback(
    (options?: { animate?: boolean }) => {
      if (!mapRef.current || !data) return;
      const bounds = getFareZonesBounds(data);
      if (!bounds) return;
      mapRef.current.fitBounds(bounds, { padding: 32, speed: 2, ...options });
    },
    [mapRef, data],
  );

  useEffect(() => {
    if (!fitOnLoad || hasFittedOnLoad.current || !data) return;
    hasFittedOnLoad.current = true;
    fitToFareZones({ animate: false });
  }, [fitOnLoad, data, fitToFareZones]);

  return { fitToFareZones };
};

export const getFareZonesBounds = (
  fareZones: FareZone[],
): LngLatBoundsLike | undefined => {
  const coordinates = fareZones.flatMap((fareZone) =>
    fareZone.geometry.coordinates.flat(),
  );
  if (!coordinates.length) return undefined;

  // Loop instead of Math.min(...spread), zone polygons can have many points.
  let [west, south] = coordinates[0];
  let [east, north] = coordinates[0];
  for (const [lon, lat] of coordinates) {
    west = Math.min(west, lon);
    east = Math.max(east, lon);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }

  return [
    [west, south],
    [east, north],
  ];
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
