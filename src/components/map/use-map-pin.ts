import { useCallback, useEffect, useState } from 'react';
import { Position } from './types';
import mapboxgl from 'mapbox-gl';

export function useMapPin(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  position: Position,
  layer?: string,
) {
  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>();

  const createMapPin = useCallback(() => {
    const pin: HTMLImageElement = document.createElement('img');
    pin.src = '/assets/mono/map/Pin.svg';
    return new mapboxgl.Marker(pin);
  }, []);

  const setMapPinPosition = useCallback(
    (position: Position) => {
      if (!mapRef || !mapRef.current) return;
      const map = mapRef.current;
      if (!marker) {
        const newMarker = createMapPin();
        setMarker(newMarker);
      }

      if (marker) marker.setLngLat(position).addTo(map);
    },
    [createMapPin, mapRef, marker],
  );

  const removeMarkerFromMap = useCallback(() => {
    if (!marker) return;
    marker.remove();
  }, [marker]);

  useEffect(() => {
    if (layer === 'address') {
      setMapPinPosition(position);
    }
    if (layer !== 'address') removeMarkerFromMap();
  }, [layer, position, setMapPinPosition, removeMarkerFromMap]);
}
