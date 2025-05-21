import { useEffect, useState } from 'react';
import {
  ComponentText,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import { GeocoderFeature, reverse } from '@atb/modules/geocoder';

export function useGeolocation(
  onSuccess: (feature: GeocoderFeature) => void,
  onError: (error: string | null) => void = () => {},
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
    isError: !!error,
    isUnavailable,
  };
}

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
