import { useMemo } from 'react';
import type { SymbolLayerSpecification } from 'mapbox-gl';
import {
  nsrSymbolLayers,
  NsrSymbolLayerTextLocation,
  getLayerPropsDeterminedByZoomLevel,
  type LayerPropsDeterminedByZoomLevelParams,
} from '@atb-as/mapbox-shared';
import { mapboxData } from '@atb/modules/org-data';
import { useTheme } from '@atb/modules/theme';

export const useNsrSymbolLayers = (): SymbolLayerSpecification[] => {
  const theme = useTheme();
  const themeName = theme.isDarkMode ? 'dark' : 'light';

  return useMemo(
    () =>
      nsrSymbolLayers.map((nsrSymbolLayer): SymbolLayerSpecification => {
        const {
          id,
          iconCode,
          textLocation,
          textField,
          reachFullScaleAtZoomLevel,
          filter,
        } = nsrSymbolLayer;

        const isInsideCircle =
          textLocation === NsrSymbolLayerTextLocation.InsideCircle;

        // Web doesn't track stop-place selection state yet; passing
        // `undefined` disables the shared helper's selection branches.
        const zoomParams: LayerPropsDeterminedByZoomLevelParams = isInsideCircle
          ? {
              reachFullScaleAtZoomLevel,
              selectedFeaturePropertyId: undefined,
              opacityTransitionZoomRangeDelay: 0,
              showTextWhileAFeatureIsSelected: true,
              textSizeFactor: 0.65,
            }
          : {
              reachFullScaleAtZoomLevel,
              selectedFeaturePropertyId: undefined,
              iconImageProps: { iconCode, themeName },
            };

        const {
          minZoomLevel,
          style: { iconImage, iconSize, iconOpacity, textSize, textOpacity },
        } = getLayerPropsDeterminedByZoomLevel(zoomParams);

        // Text inside a quay circle: color contrasts against the city color;
        // text below an icon: dark text on light halo (and vice versa in dark).
        const textColor = isInsideCircle
          ? theme.color.transport.city.primary.foreground.primary
          : theme.color.foreground.dynamic.primary;
        const textHaloColor = isInsideCircle
          ? theme.color.transport.city.primary.foreground.secondary
          : theme.color.foreground.inverse.primary;
        const textHaloWidth = isInsideCircle ? 0.3 : 2;
        const textVariableAnchor: ('center' | 'top')[] = isInsideCircle
          ? ['center']
          : ['top'];

        return {
          id,
          type: 'symbol',
          source: 'composite',
          'source-layer': mapboxData.mapboxNsrSourceLayerId,
          slot: 'middle',
          filter,
          minzoom: minZoomLevel,
          layout: {
            ...(iconCode
              ? {
                  'icon-image': iconImage,
                  'icon-size': iconSize,
                  'icon-ignore-placement': true,
                  'icon-allow-overlap': true,
                  'icon-padding': 0,
                  'icon-offset': [0, 0],
                }
              : {}),
            ...(textField
              ? {
                  'text-field': textField,
                  'text-size': textSize,
                  'text-variable-anchor': textVariableAnchor,
                  'text-anchor': 'top',
                  'text-font': [
                    'DIN Offc Pro Regular',
                    'Arial Unicode MS Regular',
                  ],
                  'text-radial-offset': 1.2,
                  'text-allow-overlap': true,
                  'text-max-width': 7,
                  'text-line-height': 0.9,
                  'text-ignore-placement': true,
                }
              : {}),
          },
          paint: {
            ...(iconCode ? { 'icon-opacity': iconOpacity } : {}),
            ...(textField
              ? {
                  'text-opacity': textOpacity,
                  'text-color': textColor,
                  'text-halo-color': textHaloColor,
                  'text-halo-width': textHaloWidth,
                  'text-translate': [0, 0],
                }
              : {}),
          },
        };
      }),
    [
      theme.color.foreground.dynamic.primary,
      theme.color.foreground.inverse.primary,
      theme.color.transport.city.primary.foreground.primary,
      theme.color.transport.city.primary.foreground.secondary,
      themeName,
    ],
  );
};
