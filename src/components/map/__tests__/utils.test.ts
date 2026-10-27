import { describe, expect, it } from 'vitest';
import type { FareZone } from '@atb/modules/firebase';
import { getFareZonesBounds } from '../utils';

function fareZone(coordinates: number[][][]): FareZone {
  return {
    id: 'TEST:FareZone:1',
    name: { lang: 'nob', value: 'Test' },
    version: '1',
    geometry: { type: 'Polygon', coordinates },
  } as FareZone;
}

describe('getFareZonesBounds', () => {
  it('should return undefined when there are no fare zones', () => {
    expect(getFareZonesBounds([])).toBeUndefined();
  });

  it('should return the bounds of a single fare zone', () => {
    const zone = fareZone([
      [
        [10, 63],
        [11, 63],
        [11, 64],
        [10, 64],
        [10, 63],
      ],
    ]);

    expect(getFareZonesBounds([zone])).toEqual([
      [10, 63],
      [11, 64],
    ]);
  });

  it('should return the bounds covering all fare zones', () => {
    const zones = [
      fareZone([
        [
          [10, 63],
          [11, 63.5],
          [10.5, 64],
        ],
      ]),
      fareZone([
        [
          [9.5, 62.5],
          [12, 63],
          [11, 63.2],
        ],
      ]),
    ];

    expect(getFareZonesBounds(zones)).toEqual([
      [9.5, 62.5],
      [12, 64],
    ]);
  });
});
