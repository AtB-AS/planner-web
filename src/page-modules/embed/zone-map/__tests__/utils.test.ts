import { describe, expect, it } from 'vitest';
import { parseZoneMapQuery } from '../utils';

describe('parseZoneMapQuery', () => {
  it('should return empty result for empty query', () => {
    expect(parseZoneMapQuery({})).toEqual({});
  });

  it('should use position and zoom when both lat and lon are given', () => {
    expect(
      parseZoneMapQuery({ lat: '67.28', lon: '14.40', zoom: '10' }),
    ).toEqual({
      initialView: { position: { lat: 67.28, lon: 14.4 }, zoom: 10 },
    });
  });

  it('should default zoom when only position is given', () => {
    expect(
      parseZoneMapQuery({ lat: '67.28', lon: '14.40' }).initialView,
    ).toEqual({ position: { lat: 67.28, lon: 14.4 }, zoom: 12 });
  });

  it('should ignore incomplete or invalid position', () => {
    expect(parseZoneMapQuery({ lat: '67.28' }).initialView).toBeUndefined();
    expect(
      parseZoneMapQuery({ lat: 'abc', lon: '14.40' }).initialView,
    ).toBeUndefined();
  });
});
