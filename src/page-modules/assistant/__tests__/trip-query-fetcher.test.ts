import { describe, expect, it, vi } from 'vitest';
import { fetchFromToTripQuery } from '../trip-query-fetcher';
import { AssistantClient } from '../server';
import { GeocoderFeature } from '@atb/modules/geocoder';

function createClient(result: GeocoderFeature[] = []) {
  const autocomplete = vi.fn().mockResolvedValue(result);
  return {
    client: { autocomplete } as unknown as AssistantClient,
    autocomplete,
  };
}

const geocodedFeature: GeocoderFeature = {
  id: 'NSR:StopPlace:41613',
  name: 'Prinsens gate',
  locality: 'Trondheim',
  category: [],
  layer: 'venue',
  geometry: { coordinates: [10.39, 63.43] },
  street: null,
};

describe('fetchFromToTripQuery', () => {
  it('should create locations from the query without using the geocoder', async () => {
    const { client, autocomplete } = createClient();

    const tripQuery = await fetchFromToTripQuery(
      {
        fromId: 'NSR:StopPlace:41613',
        fromName: 'Prinsens gate',
        fromLat: '63.43',
        fromLon: '10.39',
        fromLayer: 'venue',
        toId: '0',
        toName: 'Kongens gate 1',
        toLat: '63.42',
        toLon: '10.38',
        toLayer: 'address',
        viaId: 'NSR:StopPlace:43984',
        viaName: 'Lerkendal',
        viaLat: '63.41',
        viaLon: '10.4',
        viaLayer: 'venue',
      },
      client,
    );

    expect(autocomplete).not.toHaveBeenCalled();
    expect(tripQuery.from).toEqual({
      id: 'NSR:StopPlace:41613',
      name: 'Prinsens gate',
      layer: 'venue',
      geometry: { coordinates: [10.39, 63.43] },
      locality: null,
      category: [],
    });
    expect(tripQuery.to?.geometry.coordinates).toEqual([10.38, 63.42]);
    expect(tripQuery.to?.layer).toEqual('address');
    expect(tripQuery.via?.id).toEqual('NSR:StopPlace:43984');
  });

  it('should use the geocoder when some properties are missing', async () => {
    const { client, autocomplete } = createClient([geocodedFeature]);

    const tripQuery = await fetchFromToTripQuery(
      {
        fromId: 'NSR:StopPlace:41613',
        fromName: 'Prinsens gate',
        fromLat: '63.43',
        fromLon: '10.39',
      },
      client,
    );

    expect(autocomplete).toHaveBeenCalledTimes(1);
    expect(tripQuery.from).toEqual(geocodedFeature);
    expect(tripQuery.to).toBeNull();
  });
});
