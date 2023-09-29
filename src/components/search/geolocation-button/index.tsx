import { MonoIcon } from '@atb/assets/mono-icon';
import { Component, useEffect, useState } from 'react';
import { LoadingIcon } from '@atb/components/loading';
import { reverse } from '@atb/page-modules/departures/client';
import { GeocoderFeature } from '@atb/page-modules/departures';
import { ComponentText, useTranslation } from '@atb/translations';

type GeolocationButtonProps = {
  onGeolocate: (feature: GeocoderFeature) => void;
  className?: string;
};
function GeolocationButton({ onGeolocate, className }: GeolocationButtonProps) {
  const { t } = useTranslation();
  const { getPosition, isLoading, isUnavailable } = useGeolocation(onGeolocate);

  if (isUnavailable) return null;

  // TODO: Hide or disable the button if user blocks geolocation?

  return isLoading ? (
    <div className={className}>
      <LoadingIcon />
    </div>
  ) : (
    <button
      className={className}
      onClick={() => {
        getPosition();
      }}
      title={t(ComponentText.GeolocationButton.alt)}
      aria-label={t(ComponentText.GeolocationButton.alt)}
    >
      <MonoIcon src="places/City.svg" />
    </button>
  );
}

function useGeolocation(onSuccess: (feature: GeocoderFeature) => void) {
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) setIsUnavailable(true);
  }, []);

  const getPosition = () => {
    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const reversedPosition = await reverse(position.coords);

        onSuccess(reversedPosition);

        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setError(error);
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
