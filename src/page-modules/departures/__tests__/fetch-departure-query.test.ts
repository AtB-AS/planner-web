import { describe, expect, it, vi } from 'vitest';
import { fetchFromDepartureQuery } from '../fetch-departure-query';
import { DepartureClient } from '../server';
import { GeocoderFeature } from '@atb/modules/geocoder';

function createClient(reverseResult?: GeocoderFeature) {
  const stopPlace = vi.fn().mockResolvedValue({
    id: 'NSR:StopPlace:41613',
    name: 'Prinsens gate',
    position: { lat: 63.43, lon: 10.39 },
  });
  const reverse = vi.fn().mockResolvedValue(reverseResult);
  const autocomplete = vi.fn().mockResolvedValue([]);
  return {
    client: { stopPlace, reverse, autocomplete } as unknown as DepartureClient,
    reverse,
    autocomplete,
  };
}

const reverseFeature: GeocoderFeature = {
  id: '638651',
  name: 'Kongens gate 1',
  locality: 'Trondheim',
  category: [],
  layer: 'address',
  geometry: { coordinates: [10.381, 63.421] },
};

describe('fetchFromDepartureQuery', () => {
  it('should create the stop place location without using the geocoder', async () => {
    const { client, reverse, autocomplete } = createClient();

    const fromQuery = await fetchFromDepartureQuery(
      ['NSR:StopPlace:41613'],
      {},
      client,
    );

    expect(reverse).not.toHaveBeenCalled();
    expect(autocomplete).not.toHaveBeenCalled();
    expect(fromQuery.isAddress).toBe(false);
    expect(fromQuery.from).toEqual({
      id: 'NSR:StopPlace:41613',
      name: 'Prinsens gate',
      layer: 'venue',
      geometry: { coordinates: [10.39, 63.43] },
      locality: null,
      category: [],
    });
  });

  it('should create the address location from the query without using the geocoder', async () => {
    const { client, reverse, autocomplete } = createClient();

    const fromQuery = await fetchFromDepartureQuery(
      undefined,
      { lat: '63.42', lon: '10.38', name: 'Kongens gate 1' },
      client,
    );

    expect(reverse).not.toHaveBeenCalled();
    expect(autocomplete).not.toHaveBeenCalled();
    expect(fromQuery.isAddress).toBe(true);
    expect(fromQuery.from?.name).toEqual('Kongens gate 1');
    expect(fromQuery.from?.layer).toEqual('address');
    expect(fromQuery.from?.geometry.coordinates).toEqual([10.38, 63.42]);
  });

  it('should use the geocoder when the address name is missing', async () => {
    const { client, reverse } = createClient(reverseFeature);

    const fromQuery = await fetchFromDepartureQuery(
      undefined,
      { lat: '63.42', lon: '10.38' },
      client,
    );

    expect(reverse).toHaveBeenCalledTimes(1);
    expect(fromQuery.isAddress).toBe(true);
    expect(fromQuery.from).toEqual({
      ...reverseFeature,
      geometry: { coordinates: [10.38, 63.42] },
    });
  });
});
