import { getDefaultFocusPoint } from '@atb/modules/firebase/default-focus-point.ts';
import {
  getDefaultPositionIfCached,
  addDefaultPositionToCache,
} from './default-position-cache.ts';

export async function getDefaultPosition() {
  const cached = getDefaultPositionIfCached();
  if (cached) {
    return cached;
  }

  const defaultPosition = await getDefaultFocusPoint();
  addDefaultPositionToCache(defaultPosition);
  return defaultPosition;
}
