import { GeocoderFeature } from '@atb/modules/geocoder';
import useDebounce from '@atb/utils/use-debounce';
import { swrFetcher } from '../api-browser';
import qs from 'query-string';
import useSWRImmutable from 'swr/immutable';

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

  return useSWRImmutable<AutocompleteApiReturnType>(
    debouncedQuery !== ''
      ? `/api/departures/autocomplete?${qs.stringify(query)}`
      : null,
    swrFetcher,
  );
}
