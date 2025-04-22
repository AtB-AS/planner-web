import { swrFetcher } from '@atb/modules/api-browser';
import { GeocoderFeature } from '../../types';
import useSWR from 'swr';
import useDebounce from '@atb/utils/use-debounce';
import { getDefaultPosition } from '@atb/modules/position/utils.ts';
import { useEffect, useState } from 'react';
import { PositionType } from '@atb/modules/position';

export type AutocompleteApiReturnType = GeocoderFeature[];
export type ReverseApiReturnType = GeocoderFeature | undefined;

const DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS = 300;

export function useAutocomplete(
  q: string,
  autocompleteFocusPoint?: GeocoderFeature,
) {
  const defaultPosition = getDefaultPosition();
  const debouncedQuery = useDebounce(q, DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS);
  const latFocusPoint =
    autocompleteFocusPoint?.geometry.coordinates[0] ?? defaultPosition.lat;
  const lonFocusPoint =
    autocompleteFocusPoint?.geometry.coordinates[1] ?? defaultPosition.lon;

  const query = `/api/departures/autocomplete?q=${debouncedQuery}&lat=${latFocusPoint}&lon=${lonFocusPoint}`;

  return useSWR<AutocompleteApiReturnType>(
    debouncedQuery !== '' ? query : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
}

export async function reverse(coords: GeolocationCoordinates) {
  const result = await fetch(
    `/api/departures/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
  );

  return await result.json();
}
