import { Component, useEffect, useState } from 'react';
import { LoadingIcon } from '@atb/components/loading';
import { reverse } from '@atb/page-modules/departures/client';
import { GeocoderFeature } from '@atb/page-modules/departures';
import {
  ComponentText,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';

type GeolocationButtonProps = {
  onGeolocate: (feature: GeocoderFeature) => void;
  onError?: (error: string | null) => void;
  className?: string;
};
function GeolocationButton({
  onGeolocate,
  onError,
  className,
}: GeolocationButtonProps) {
  const { t } = useTranslation();
  const { getPosition, isLoading, isUnavailable } = useGeolocation(
    onGeolocate,
    onError,
  );

  if (isUnavailable) return null;

  return isLoading ? (
    <div className={className}>
      <LoadingIcon a11yText={t(ComponentText.GeolocationButton.loading)} />
    </div>
  ) : (
    <button
      className={className}
      onClick={getPosition}
      title={t(ComponentText.GeolocationButton.alt)}
      aria-label={t(ComponentText.GeolocationButton.alt)}
      type="button"
    >
      <MonoIcon icon="places/City" />
    </button>
  );
}

function useGeolocation(
  onSuccess: (feature: GeocoderFeature) => void,
  onError: (error: string | null) => void = () => { },
) {
  const { t } = useTranslation();
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) setIsUnavailable(true);
  }, []);

  const getPosition = () => {
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const reversedPosition = await reverse(position.coords);

        onSuccess(reversedPosition);

        setIsLoading(false);
      },
      (error) => {
        onError?.(getErrorMessage(error.code, t));
        setError(error);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return {
    getPosition,
    error,
    isLoading,
    isUnavailable,
  };
}

export default GeolocationButton;

function getErrorMessage(code: number, t: TranslateFunction) {
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return t(ComponentText.GeolocationButton.error.denied);
    case GeolocationPositionError.TIMEOUT:
      return t(ComponentText.GeolocationButton.error.timeout);
    case GeolocationPositionError.POSITION_UNAVAILABLE:
    default:
      return t(ComponentText.GeolocationButton.error.unavailable);
  }
}
