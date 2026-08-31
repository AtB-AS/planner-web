import { useCallback, useEffect, useRef, useState } from 'react';
import type { Map } from 'mapbox-gl';
import type { VehicleWithPosition } from '@atb/page-modules/departures/client/vehicles';

const FOLLOW_ANIMATION_DURATION_MS = 500;
// Matches the mobile app's FOLLOW_ZOOM_LEVEL. Applied once when the vehicle is
// first acquired so the map zooms in on the bus, mirroring the app's initial
// camera. Later follow updates only recenter, leaving zoom under user control.
const FOLLOW_ZOOM_LEVEL = 14.5;

type Options = {
  enabled: boolean;
};

export function useMapFollow(
  mapRef: React.RefObject<Map | undefined>,
  vehicle: VehicleWithPosition | undefined,
  { enabled }: Options,
): { onMarkerClick: () => void } {
  const [shouldFollow, setShouldFollow] = useState(enabled);
  const hasAppliedFollowZoom = useRef(false);

  useEffect(() => {
    setShouldFollow(enabled);
    if (!enabled) hasAppliedFollowZoom.current = false;
  }, [enabled]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !enabled) return;

    // Filter to user-driven camera changes only (originalEvent is undefined on
    // programmatic moves like easeTo).
    const onMoveStart = (e: { originalEvent?: unknown }) => {
      if (e.originalEvent) setShouldFollow(false);
    };
    map.on('movestart', onMoveStart);
    return () => {
      map.off('movestart', onMoveStart);
    };
  }, [mapRef, enabled]);

  useEffect(() => {
    if (!enabled || !shouldFollow || !vehicle?.location) return;
    const map = mapRef.current;
    if (!map) return;
    const center: [number, number] = [
      vehicle.location.longitude,
      vehicle.location.latitude,
    ];
    if (!hasAppliedFollowZoom.current) {
      hasAppliedFollowZoom.current = true;
      map.easeTo({
        center,
        zoom: FOLLOW_ZOOM_LEVEL,
        duration: FOLLOW_ANIMATION_DURATION_MS,
      });
    } else {
      map.easeTo({ center, duration: FOLLOW_ANIMATION_DURATION_MS });
    }
  }, [mapRef, enabled, shouldFollow, vehicle]);

  const onMarkerClick = useCallback(() => {
    setShouldFollow(true);
  }, []);

  return { onMarkerClick };
}
