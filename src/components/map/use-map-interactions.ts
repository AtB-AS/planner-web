import { useEffect } from 'react';
import {
  INTERACTIVE_LAYERS,
  ZOOM_LEVEL,
  isFeaturePoint,
  isStopPlace,
} from './utils';
import { Position } from './types';

export function useMapInteractions(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  onSelectStopPlace?: (id: string) => void,
) {
  useEffect(() => {
    if (!mapRef || !onSelectStopPlace) return;
    const map = mapRef.current;

    const handleMouseEnter = () => {
      if (map) map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (map) map.getCanvas().style.cursor = '';
    };

    const handleStopPlaceClick = (e: mapboxgl.MapMouseEvent) => {
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point);
      if (
        features.length &&
        isFeaturePoint(features[0]) &&
        isStopPlace(features[0])
      ) {
        onSelectStopPlace(features[0].properties?.id);
      }
    };

    if (map) {
      map.on('load', () => {
        map.on('mouseenter', INTERACTIVE_LAYERS, handleMouseEnter);
        map.on('mouseleave', INTERACTIVE_LAYERS, handleMouseLeave);
        map.on('click', handleStopPlaceClick);
      });
    }
  }, [mapRef, onSelectStopPlace]);

  const centerMap = (position: Position) => {
    if (!mapRef || !mapRef.current) return;
    mapRef.current.flyTo({ center: position, zoom: ZOOM_LEVEL, speed: 2 });
  };

  return { centerMap };
}
