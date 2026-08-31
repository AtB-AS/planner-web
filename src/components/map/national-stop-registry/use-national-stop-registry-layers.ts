import { useEffect, useState } from 'react';
import { useNsrCircleLayers } from './use-nsr-circle-layers';
import { useNsrSymbolLayers } from './use-nsr-symbol-layers';
import { addLayerIfNotExists } from '../utils';

// Adds National Stop Registry (NSR) layers to the map after style load.
// Circle layers render below symbol layers, matching the mobile app.
export const useNationalStopRegistryLayers = (
  mapRef: React.RefObject<mapboxgl.Map | undefined>,
) => {
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);
  const circleLayers = useNsrCircleLayers();
  const symbolLayers = useNsrSymbolLayers();

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleStyleLoad = () => setIsStyleLoaded(true);
    map.on('style.load', handleStyleLoad);
    if (map.isStyleLoaded()) setIsStyleLoaded(true);

    return () => {
      map.off('style.load', handleStyleLoad);
      setIsStyleLoaded(false);
    };
  }, [mapRef]);

  useEffect(() => {
    if (!isStyleLoaded || !mapRef.current) return;
    const map = mapRef.current;

    circleLayers.forEach((layer) => addLayerIfNotExists(map, layer));
    symbolLayers.forEach((layer) => addLayerIfNotExists(map, layer));
  }, [isStyleLoaded, mapRef, circleLayers, symbolLayers]);
};
