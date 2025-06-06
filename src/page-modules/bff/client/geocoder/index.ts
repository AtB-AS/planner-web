import { swrFetcher } from '@atb/modules/api-browser';
import useDebounce from '@atb/utils/use-debounce';
import useSWRImmutable from 'swr/immutable';
import qs from 'query-string';
import { GeocoderFeature } from '@atb/modules/geocoder';

export type AutocompleteApiReturnType = GeocoderFeature[];
export type ReverseApiReturnType = GeocoderFeature | undefined;

const DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS = 300;

export function useAutocomplete(
  q: string,
  autocompleteFocusPoint?: GeocoderFeature,
  onlyStopPlaces?: boolean,
) {
  const debouncedQuery = useDebounce(q, DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS);

  const queryObj = {
    query: debouncedQuery,
    lon: autocompleteFocusPoint?.geometry.coordinates[0],
    lat: autocompleteFocusPoint?.geometry.coordinates[1],
    onlyStopPlaces,
  };

  return useSWRImmutable<AutocompleteApiReturnType>(
    debouncedQuery !== ''
      ? `/api/departures/autocomplete?q=${qs.stringify(queryObj, { skipNull: true })}`
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
