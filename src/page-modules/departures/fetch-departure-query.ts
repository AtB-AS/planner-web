import { parseSearchTimeQuery } from '@atb/modules/search-time';
import type { DepartureClient } from './server';
import type { FromDepartureQuery } from './types';

export async function fetchFromDepartureQuery(
  paramId: string[] | undefined,
  query: any,
  client: DepartureClient,
): Promise<FromDepartureQuery> {
  const id = paramId?.[0];
  const searchTime = parseSearchTimeQuery(
    query.searchMode,
    query.searchTime ? Number(query.searchTime) : undefined,
  );

  if (id) {
    const stopPlace = await client.stopPlace({ id });
    if (stopPlace.position.lat && stopPlace.position.lon) {
      const from = await client.reverse(
        stopPlace.position.lat,
        stopPlace.position.lon,
        'venue',
      );
      return {
        isAddress: false,
        searchTime,
        from: from ?? null,
      };
    }
  } else if (query.lat && query.lon) {
    const position = {
      lat: parseFloat(query.lat.toString()),
      lon: parseFloat(query.lon.toString()),
    };

    const from = await client
      .autocomplete(query.name, {
        lat: position.lat,
        lon: position.lon,
      })
      .then((result) => {
        return result[0];
      });

    return {
      isAddress: true,
      from: from ?? null,
      searchTime,
    };
  }

  return {
    from: null,
    isAddress: false,
    searchTime,
  };
}
