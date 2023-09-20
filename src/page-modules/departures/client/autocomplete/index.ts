import { swrFetcher } from '@atb/modules/api-browser';
import { AutocompleteFeature } from '../../types';
import useSWR from 'swr';

export type AutocompleteApiReturnType = AutocompleteFeature[];

export function useAutocomplete(q: string) {
  console.log(q);
  return useSWR<AutocompleteApiReturnType>(
    `/api/departures/autocomplete?q=${q}`,
    swrFetcher,
  );
}
