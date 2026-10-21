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
      return {
        isAddress: false,
        searchTime,
        from: {
          id: stopPlace.id,
          name: stopPlace.name,
          layer: 'venue',
          geometry: {
            coordinates: [stopPlace.position.lon, stopPlace.position.lat],
          },
          locality: null,
          category: [],
        },
      };
    }
  } else if (query.lat && query.lon) {
    const lat = parseFloat(query.lat.toString());
    const lon = parseFloat(query.lon.toString());
    const name = query.name?.toString();

    if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
      // Only use the geocoder to find a name when the URL lacks one.
      const from = name
        ? {
            id: `${lat},${lon}`,
            name,
            layer: 'address' as const,
            geometry: { coordinates: [lon, lat] },
            locality: null,
            category: [],
          }
        : await client.reverse(lat, lon, ['address']).then(
            // Keep the requested position, as the address can be further away.
            (feature) =>
              feature && { ...feature, geometry: { coordinates: [lon, lat] } },
          );

      return {
        isAddress: true,
        from: from ?? null,
        searchTime,
      };
    }
  }

  return {
    from: null,
    isAddress: false,
    searchTime,
  };
}
