import { useMemo } from 'react';
import type { CircleLayerSpecification } from 'mapbox-gl';
import {
  nsrCircleLayers,
  getLayerPropsDeterminedByZoomLevel,
} from '@atb-as/mapbox-shared';
import { mapboxData } from '@atb/modules/org-data';
import { useTheme } from '@atb/modules/theme';

const CIRCLE_STROKE_WIDTH = 1.1;
const CIRCLE_FULL_RADIUS = 11;

export const useNsrCircleLayers = (): CircleLayerSpecification[] => {
  const theme = useTheme();
  const circleColor = theme.color.transport.city.primary.background;
  const circleStrokeColor =
    theme.color.transport.city.primary.foreground.primary;

  return useMemo(
    () =>
      nsrCircleLayers.map((nsrCircleLayer): CircleLayerSpecification => {
        const { id, reachFullScaleAtZoomLevel, filter } = nsrCircleLayer;

        // The zoom-props helper aliases iconSize/iconOpacity → circleRadius/circleOpacity.
        const {
          minZoomLevel,
          style: { iconSize, iconOpacity },
        } = getLayerPropsDeterminedByZoomLevel({
          reachFullScaleAtZoomLevel,
          selectedFeaturePropertyId: undefined,
          iconFullSize: CIRCLE_FULL_RADIUS,
        });

        return {
          id,
          type: 'circle',
          source: 'composite',
          'source-layer': mapboxData.mapboxNsrSourceLayerId,
          slot: 'middle',
          filter,
          minzoom: minZoomLevel,
          paint: {
            'circle-radius': iconSize,
            'circle-opacity': iconOpacity,
            'circle-color': circleColor,
            'circle-stroke-color': circleStrokeColor,
            'circle-stroke-width': CIRCLE_STROKE_WIDTH,
            'circle-translate': [0, 0],
          },
        };
      }),
    [circleColor, circleStrokeColor],
  );
};
