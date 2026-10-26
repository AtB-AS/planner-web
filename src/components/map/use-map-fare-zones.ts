import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Language, useTranslation } from '@atb/translations';
import type { LayerSpecification, LngLatBoundsLike } from 'mapbox-gl';
import { getReferenceDataName } from '@atb/utils/reference-data';
import { centroid } from '@turf/centroid';
import { type FareZone } from '@atb/modules/firebase';
import { swrFetcher } from '@atb/modules/api-browser';
import { addLayerIfNotExists, addSourceIfNotExists } from '.';
import useSWRImmutable from 'swr/immutable';

const FARE_ZONE_SOURCE_ID = 'fare-zones';
const ZONE_BOUNDARY_LAYER_ID = 'zone-boundary-layer';
const ZONE_NAMES_LAYER_ID = 'zone-names-layer';
const FARE_ZONES_BOUNDS_PADDING = 32;

export const useMapFareZones = (
  mapRef: React.RefObject<mapboxgl.Map | undefined>,
  { fitToZones = false }: { fitToZones?: boolean } = {},
) => {
  const { language } = useTranslation();
  const [isZonesVisible, setIsZonesVisible] = useState(false);
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const { data } = useSWRImmutable<FareZone[]>(
    '/api/config/fare-zones',
    swrFetcher,
  );

  const fareZonesBounds = useMemo(
    () => (data ? getFareZonesBounds(data) : undefined),
    [data],
  );
  const hasFittedToZones = useRef(false);

  const fitBoundsToFareZones = useCallback(
    (options?: { animate?: boolean }) => {
      if (!mapRef.current || !fareZonesBounds) return;
      mapRef.current.fitBounds(fareZonesBounds, {
        padding: FARE_ZONES_BOUNDS_PADDING,
        animate: options?.animate ?? true,
      });
    },
    [mapRef, fareZonesBounds],
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

  useEffect(() => {
    if (!fitToZones || hasFittedToZones.current || !fareZonesBounds) return;
    hasFittedToZones.current = true;
    fitBoundsToFareZones({ animate: false });
  }, [fitToZones, fareZonesBounds, fitBoundsToFareZones]);

  return { fitBoundsToFareZones };
};

export const getFareZonesBounds = (
  fareZones: FareZone[],
): LngLatBoundsLike | undefined => {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  // Polygons can be detailed, so avoid spreading all positions into Math.min.
  for (const fareZone of fareZones) {
    for (const ring of fareZone.geometry.coordinates) {
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon);
        minLat = Math.min(minLat, lat);
        maxLon = Math.max(maxLon, lon);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }
  if (minLon === Infinity) return undefined;

  return [
    [minLon, minLat],
    [maxLon, maxLat],
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
