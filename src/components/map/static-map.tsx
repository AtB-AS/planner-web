import { mapboxData } from '@atb/modules/org-data';
import { Position } from './types';
import {
  ZOOM_LEVEL,
  defaultPosition,
  getMapBounds,
  hasInitialPosition,
  hasMapLegs,
} from './utils';

export type StaticMapProps = {
  layer?: 'address' | 'venue';
  position: Position;
  initialZoom?: number;
  size: { width: number; height: number };
};

export function getStaticMapUrl(props: StaticMapProps) {
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
