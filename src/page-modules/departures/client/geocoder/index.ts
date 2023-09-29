import { swrFetcher } from '@atb/modules/api-browser';
import { GeocoderFeature } from '../../types';
import useSWR from 'swr';
import useDebounce from '@atb/utils/use-debounce';

export type AutocompleteApiReturnType = GeocoderFeature[];
export type ReverseApiReturnType = GeocoderFeature | undefined;

export function useAutocomplete(q: string) {
  const debouncedQuery = useDebounce(q, 500);

  return useSWR<AutocompleteApiReturnType>(
    debouncedQuery !== ''
      ? `/api/departures/autocomplete?q=${debouncedQuery}`
      : null,
    swrFetcher,
  );
}

export async function reverse(coords: GeolocationCoordinates) {
  const result = await fetch(
    `/api/departures/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
  );

  return await result.json();
}
