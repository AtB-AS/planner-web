import { swrFetcher } from '@atb/modules/api-browser';
import { AutocompleteFeature } from '../../types';
import useSWR from 'swr';
import useDebounce from '@atb/utils/use-debounce';

export type AutocompleteApiReturnType = AutocompleteFeature[];

export function useAutocomplete(q: string) {
  const debouncedQuery = useDebounce(q, 500);

  return useSWR<AutocompleteApiReturnType>(
    `/api/departures/autocomplete?q=${debouncedQuery}`,
    swrFetcher,
  );
}
