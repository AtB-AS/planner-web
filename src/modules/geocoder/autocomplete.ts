import { GeocoderFeature } from '@atb/modules/geocoder';
import useDebounce from '@atb/utils/use-debounce';
import useSWR from 'swr';
import { swrFetcher } from '../api-browser';
import qs from 'query-string';

export type AutocompleteApiReturnType = GeocoderFeature[];

const DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS = 300;

export function useAutocomplete(
  q: string,
  autocompleteFocusPoint?: GeocoderFeature,
  onlyStopPlaces?: boolean,
) {
  const debouncedQuery = useDebounce(q, DEBOUNCE_TIME_AUTOCOMPLETE_IN_MS);

  const query = {
    q: debouncedQuery,
    lon: autocompleteFocusPoint?.geometry.coordinates[0],
    lat: autocompleteFocusPoint?.geometry.coordinates[1],
    onlyStopPlaces,
  };

  return useSWR<AutocompleteApiReturnType>(
    debouncedQuery !== ''
      ? `/api/bff/autocomplete?${qs.stringify(query)}`
      : null,
    swrFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
}
