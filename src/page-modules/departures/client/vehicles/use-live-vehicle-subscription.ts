import { useCallback, useEffect, useState } from 'react';
import { useSubscription } from '@atb/utils/use-subscription';
import type { VehicleWithPosition } from './types';

const DISCONNECT_DEBOUNCE_MS = 3000;

function getWsUrl(serviceJourneyId: string): string | null {
  const base = process.env.NEXT_PUBLIC_WS_API_BASE_URL;
  if (!base) return null;
  return (
    base.replace(/\/$/, '') +
    '/ws/v2/vehicles/service-journey/subscription?serviceJourneyId=' +
    encodeURIComponent(serviceJourneyId)
  );
}

type Options = {
  serviceJourneyId?: string;
  enabled: boolean;
};

export function useLiveVehicleSubscription({
  serviceJourneyId,
  enabled,
}: Options): [VehicleWithPosition | undefined, boolean] {
  const [liveVehicle, setLiveVehicle] = useState<
    VehicleWithPosition | undefined
  >();
  // `isConnectionDown` reflects the socket state immediately; `isDisconnected`
  // is the debounced value the UI reacts to, so short reconnects don't flash an
  // error state. Keeping the timer in a useEffect lets React tear it down on
  // unmount (mirrors the mobile app's useIsLoading).
  const [isConnectionDown, setIsConnectionDown] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const isVisible = useDocumentVisibility();

  const onMessage = useCallback((event: MessageEvent) => {
    // Set as false every time, React will not update if the value is the same.
    setIsConnectionDown(false);
    const vehicle = JSON.parse(event.data) as VehicleWithPosition;
    setLiveVehicle(vehicle);
  }, []);

  const onClose = useCallback(() => setIsConnectionDown(true), []);

  useSubscription({
    url: serviceJourneyId ? getWsUrl(serviceJourneyId) : null,
    enabled: enabled && isVisible,
    onMessage,
    onClose,
  });

  useEffect(() => {
    if (!isConnectionDown) {
      setIsDisconnected(false);
      return;
    }
    const timer = setTimeout(
      () => setIsDisconnected(true),
      DISCONNECT_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [isConnectionDown]);

  return [liveVehicle, isDisconnected];
}

function useDocumentVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(() =>
    typeof document === 'undefined'
      ? true
      : document.visibilityState === 'visible',
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onChange = () => setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return isVisible;
}
