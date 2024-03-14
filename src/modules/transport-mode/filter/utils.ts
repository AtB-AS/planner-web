import { uniq } from 'lodash';
import type { TransportModeGroup } from '../types';
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter';

export function parseFilterQuery(
  filterQuery: string | string[] | undefined,
): string[] | null {
  if (!filterQuery) return null;

  return filterQuery.toString().split(',');
}

export async function getAllTransportModesFromFilterOptions(
  filterOptions: string[] | null,
): Promise<TransportModeGroup[] | undefined> {
  const transportModeFilter = await getTransportModeFilter();

  if (!transportModeFilter) return;

  const transportModes: TransportModeGroup[] = transportModeFilter
    .filter((option) => !filterOptions || filterOptions.includes(option.id))
    .flatMap((option) => option.modes);

  return uniq(transportModes);
}

export function parseInputFilterString(transportModeFilter: string[] | null) {
  return transportModeFilter ? transportModeFilter.join(',') : '';
}
