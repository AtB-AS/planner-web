import { describe, expect, it } from 'vitest';
import { setTransportModeFilters } from '../utils';
import { TravelSearchFiltersType } from '@atb-as/config-specs';

describe('setTransportModeFilters', () => {
  it('should only return transport mode filters where `selectedAsDefault` is true.', () => {
    const tmfInput = [
      { id: 'bus', selectedAsDefault: true },
      { id: 'air', selectedAsDefault: false },
    ] as TravelSearchFiltersType['transportModes'];

    const transportModeFilters = setTransportModeFilters(tmfInput);
    expect(transportModeFilters).toEqual(['bus']);
  });

  it('should not return transport mode filters where `selectedAsDefault` is undefined.', () => {
    const tmfInput = [
      { id: 'bus', selectedAsDefault: true },
      { id: 'air' },
      { id: 'rail', selectedAsDefault: undefined },
    ] as TravelSearchFiltersType['transportModes'];

    const transportModeFilters = setTransportModeFilters(tmfInput);
    expect(transportModeFilters).toEqual(['bus']);
  });
});
