import { useMemo } from 'react';
import type { LayerSpecification, StyleSpecification } from 'mapbox-gl';
import useSWRImmutable from 'swr/immutable';
import { mapboxData } from '@atb/modules/org-data';
import { getMapboxSpriteUrl } from '@atb/modules/firebase';
import { useDarkMode } from '@atb/modules/theme';
import { getMapboxLightStyle, getMapboxDarkStyle } from '@atb-as/mapbox-shared';

// Emissive strength keeps our custom layers unaffected by the Standard
// basemap's `lightPreset` (day/night) so they don't dim in dark mode.
// mapbox-gl JS validates paint properties per layer type, so we can only
// add the ones that match the layer's type.
const emissiveByType: Record<string, Record<string, number>> = {
  background: { 'background-emissive-strength': 1 },
  fill: { 'fill-emissive-strength': 1 },
  line: { 'line-emissive-strength': 1 },
  symbol: {
    'icon-emissive-strength': 1,
    'text-emissive-strength': 1,
  },
  circle: { 'circle-emissive-strength': 1 },
  'fill-extrusion': { 'fill-extrusion-emissive-strength': 1 },
  model: { 'model-emissive-strength': 1 },
};

export const useMapboxJsonStyle = (): StyleSpecification | undefined => {
  const { data: spriteUrl } = useSWRImmutable(
    'mapboxSpriteUrl',
    getMapboxSpriteUrl,
  );
  const [isDarkMode] = useDarkMode();

  return useMemo(() => {
    if (!spriteUrl) return undefined;
    const themeName = isDarkMode ? 'dark' : 'light';
    const themedStyle = isDarkMode
      ? getMapboxDarkStyle(
          mapboxData.mapboxUserName,
          mapboxData.mapboxNsrTilesetId,
        )
      : getMapboxLightStyle(
          mapboxData.mapboxUserName,
          mapboxData.mapboxNsrTilesetId,
        );

    // Place all copied basemap layers in Standard's "middle" slot (above roads,
    // below place labels), and neutralize them against lightPreset.
    const themedLayers = themedStyle.layers.map((layer) => ({
      ...layer,
      slot: 'middle',
      paint: {
        ...(layer as { paint?: Record<string, unknown> }).paint,
        ...(emissiveByType[(layer as { type: string }).type] ?? {}),
      },
    })) as LayerSpecification[];

    // The 3D Mapbox Standard basemap import is intentionally omitted here.
    // Mobile also disables it in production (`enable_map_3d` remote-config
    // toggle set to false); slot/emissive props stay on the layers so this
    // stays a one-line change when the toggle flips back.
    return {
      ...themedStyle,
      version: 8,
      layers: themedLayers,
      sprite: spriteUrl + themeName,
      projection: { name: 'mercator' },
    } as StyleSpecification;
  }, [spriteUrl, isDarkMode]);
};
