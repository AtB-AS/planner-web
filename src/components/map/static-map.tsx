import { mapboxData } from '@atb/modules/org-data';
import { MapLegType } from './types';
import {
  ZOOM_LEVEL,
  getMapBounds,
  hasInitialPosition,
  hasMapLegs,
} from './utils';
import { PositionType } from '@atb/modules/position';
import { getDefaultPosition } from '@atb/modules/position/utils.ts';

export type StaticMapProps = {
  layer?: 'address' | 'venue';
  size: { width: number; height: number };
} & (
  | {
      position: Partial<PositionType>;
      initialZoom?: number;
    }
  | {
      mapLegs: MapLegType[];
    }
);

export async function getStaticMapUrl(props: StaticMapProps) {
  const defaultPosition = await getDefaultPosition();
  const mapLegs = hasMapLegs(props) ? props.mapLegs : undefined;
  const { position, initialZoom = ZOOM_LEVEL } = hasInitialPosition(props)
    ? props
    : { position: defaultPosition, initialZoom: ZOOM_LEVEL };
  const bounds = mapLegs ? getMapBounds(mapLegs) : undefined;

  const params = bounds
    ? `${bounds}`
    : `${position.lon},${position.lat},${initialZoom}`;

  return `https://api.mapbox.com/styles/v1/${mapboxData.styleAndId}/static/${params}/${props.size.width}x${props.size.height}?access_token=${mapboxData.accessToken}`;
}
