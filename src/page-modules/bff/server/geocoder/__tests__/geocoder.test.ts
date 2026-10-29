import { describe, expect, it, vi } from 'vitest';
import { createBffGeocoderApi } from '..';
import type { Feature } from '../../../../../modules/geocoder/types';

const stopPlaceFeature: Feature = {
  geometry: { coordinates: [10.399, 63.4305], type: 'Point' },
  properties: {
    id: 'NSR:StopPlace:41613',
    names: { default: 'Prinsens gate', display: 'Prinsens gate, Trondheim' },
    layer: 'stopPlace',
    address: { locality: 'Trondheim' },
    stopPlaceTypes: ['onstreetBus', 'unknownType'],
  },
};

const addressFeature: Feature = {
  geometry: { coordinates: [10.395, 63.43], type: 'Point' },
  properties: {
    id: 'KVE:PostalAddress:123',
    names: { default: 'Kongens gate 1', display: 'Kongens gate 1, Trondheim' },
    layer: 'address',
    address: {
      streetName: 'Kongens gate',
      houseNumber: '1',
      locality: 'Trondheim',
    },
  },
};

function createApi(features: Feature[]) {
  const request = vi.fn().mockResolvedValue({ json: async () => features });
  return { api: createBffGeocoderApi(request as any), request };
}

describe('bff geocoder', () => {
  it('maps v3 features to geocoder features', async () => {
    const { api, request } = createApi([stopPlaceFeature, addressFeature]);

    const result = await api.autocomplete('gate', { layers: ['stopPlace'] });

    expect(request.mock.calls[0][0]).toMatch(/^\/v2\/geocoder\/features\?/);
    expect(request.mock.calls[0][0]).toContain('multimodal=parent');
    expect(result).toEqual([
      {
        id: 'NSR:StopPlace:41613',
        name: 'Prinsens gate',
        locality: 'Trondheim',
        category: ['onstreetBus'],
        layer: 'venue',
        geometry: stopPlaceFeature.geometry,
        street: null,
        housenumber: null,
      },
      {
        id: 'KVE:PostalAddress:123',
        name: 'Kongens gate 1',
        locality: 'Trondheim',
        category: [],
        layer: 'address',
        geometry: addressFeature.geometry,
        street: 'Kongens gate',
        housenumber: '1',
      },
    ]);
  });

  it('maps non-stop-place layers to address', async () => {
    const { api } = createApi([
      {
        ...stopPlaceFeature,
        properties: {
          ...stopPlaceFeature.properties,
          layer: 'groupOfStopPlaces',
        },
      },
    ]);

    const [result] = await api.autocomplete('trondheim');

    expect(result.layer).toBe('address');
  });

  it('returns the first feature on reverse', async () => {
    const { api, request } = createApi([addressFeature, stopPlaceFeature]);

    const result = await api.reverse(63.43, 10.395, ['address', 'street']);

    expect(request.mock.calls[0][0]).toMatch(/^\/v2\/geocoder\/reverse\?/);
    expect(result?.id).toBe('KVE:PostalAddress:123');
  });
});
