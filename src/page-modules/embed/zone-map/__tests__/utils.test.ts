import { describe, expect, it } from 'vitest';
import { defaultPosition } from '@atb/components/map';
import { DEFAULT_ZONE_MAP_ZOOM, parseZoneMapQuery } from '../utils';

describe('parseZoneMapQuery', () => {
  it('should use defaults when no query params are given', () => {
    expect(parseZoneMapQuery({})).toEqual({
      position: defaultPosition,
      zoom: DEFAULT_ZONE_MAP_ZOOM,
    });
  });

  it('should parse lat, lon and zoom', () => {
    expect(
      parseZoneMapQuery({ lat: '63.43', lon: '10.39', zoom: '11.5' }),
    ).toEqual({
      position: { lat: 63.43, lon: 10.39 },
      zoom: 11.5,
    });
  });

  it('should use default position when only one of lat and lon is given', () => {
    expect(parseZoneMapQuery({ lat: '63.43' }).position).toEqual(
      defaultPosition,
    );
    expect(parseZoneMapQuery({ lon: '10.39' }).position).toEqual(
      defaultPosition,
    );
  });

  it('should keep valid params when another param is invalid', () => {
    expect(
      parseZoneMapQuery({ lat: '63.43', lon: '10.39', zoom: 'abc' }),
    ).toEqual({
      position: { lat: 63.43, lon: 10.39 },
      zoom: DEFAULT_ZONE_MAP_ZOOM,
    });
  });

  it('should treat empty values as missing', () => {
    expect(parseZoneMapQuery({ lat: '', lon: '', zoom: '' })).toEqual({
      position: defaultPosition,
      zoom: DEFAULT_ZONE_MAP_ZOOM,
    });
  });

  it('should ignore repeated params', () => {
    expect(parseZoneMapQuery({ zoom: ['10', '12'] }).zoom).toBe(
      DEFAULT_ZONE_MAP_ZOOM,
    );
  });

  it.each([
    { lat: '-90.1', lon: '10.39' },
    { lat: '90.1', lon: '10.39' },
    { lat: '63.43', lon: '-180.1' },
    { lat: '63.43', lon: '180.1' },
  ])('should use default position for out of range %o', (query) => {
    expect(parseZoneMapQuery(query).position).toEqual(defaultPosition);
  });

  it('should accept boundary values', () => {
    expect(parseZoneMapQuery({ lat: '-90', lon: '180', zoom: '0' })).toEqual({
      position: { lat: -90, lon: 180 },
      zoom: 0,
    });
    expect(parseZoneMapQuery({ zoom: '22' }).zoom).toBe(22);
  });

  it.each(['-1', '22.1'])(
    'should use default zoom for out of range %s',
    (zoom) => {
      expect(parseZoneMapQuery({ zoom }).zoom).toBe(DEFAULT_ZONE_MAP_ZOOM);
    },
  );
});
