import { parseSearchTimeQuery } from '@atb/modules/search-time';
import { parseFilterQuery } from '@atb/modules/transport-mode';
import type { DepartureClient } from './server';
import type { FromDepartureQuery } from './types';

export async function fetchFromDepartureQuery(
  paramId: string[] | undefined,
  query: any,
  client: DepartureClient,
): Promise<FromDepartureQuery> {
  const id = paramId?.[0];
  const transportModeFilter = parseFilterQuery(query.filter);
  const searchTime = parseSearchTimeQuery(
    query.searchMode,
    query.searchTime ? Number(query.searchTime) : undefined,
  );

  if (id) {
    const stopPlace = await client.stopPlace({ id });
    const from = await client.reverse(
      stopPlace.position.lat,
      stopPlace.position.lon,
      'venue',
    );

    return {
      isAddress: false,
      transportModeFilter,
      searchTime,
      from: from ?? null,
    };
  } else if (query.lat && query.lon) {
    const position = {
      lat: parseFloat(query.lat.toString()),
      lon: parseFloat(query.lon.toString()),
    };

    const from = await client.reverse(position.lat, position.lon, 'address');

    return {
      isAddress: true,
      from: from ?? null,
      transportModeFilter,
      searchTime,
    };
  }

  return {
    from: null,
    isAddress: false,
    transportModeFilter,
    searchTime,
  };
}
