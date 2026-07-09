import { describe, it, expect } from 'vitest';
import { getAffectedStopNames, getMostCriticalStatus } from '../utils';
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';

type Affects = SituationFragment['affects'];

describe('getAffectedStopNames', () => {
  it('returns empty array when affects is empty', () => {
    expect(getAffectedStopNames([])).toEqual([]);
  });

  it('extracts names from all stop-place variants, preferring stopPlace over quay', () => {
    const affects: Affects = [
      {
        __typename: 'AffectedStopPlace',
        stopPlace: { name: 'Stop' },
        quay: { name: 'Quay' },
      },
      {
        __typename: 'AffectedStopPlaceOnLine',
        quay: { name: 'On line quay' },
      },
      {
        __typename: 'AffectedStopPlaceOnServiceJourney',
        stopPlace: { name: 'On journey stop' },
      },
    ];
    expect(getAffectedStopNames(affects)).toEqual([
      'Stop',
      'On line quay',
      'On journey stop',
    ]);
  });

  it('skips non stop-place variants and entries without stopPlace or quay', () => {
    const affects: Affects = [
      { __typename: 'AffectedLine' },
      { __typename: 'AffectedServiceJourney' },
      { __typename: 'AffectedUnknown' },
      { __typename: 'AffectedStopPlace' },
      { __typename: 'AffectedStopPlace', stopPlace: { name: 'Kept' } },
    ];
    expect(getAffectedStopNames(affects)).toEqual(['Kept']);
  });

  it('deduplicates names', () => {
    const affects: Affects = [
      { __typename: 'AffectedStopPlace', stopPlace: { name: 'A' } },
      { __typename: 'AffectedStopPlace', stopPlace: { name: 'B' } },
      { __typename: 'AffectedStopPlaceOnLine', stopPlace: { name: 'A' } },
    ];
    expect(getAffectedStopNames(affects)).toEqual(['A', 'B']);
  });
});

describe('getMostCriticalStatusColor', () => {
  it('returns undefined for an empty list', () => {
    expect(getMostCriticalStatus([])).toBeUndefined();
  });

  it('returns undefined when every entry is undefined', () => {
    expect(getMostCriticalStatus([undefined, undefined])).toBeUndefined();
  });

  it('ignores undefined entries', () => {
    expect(getMostCriticalStatus([undefined, 'info', undefined])).toBe('info');
  });

  it('picks the most severe status regardless of order', () => {
    expect(getMostCriticalStatus(['valid', 'error', 'info', 'warning'])).toBe(
      'error',
    );
    expect(getMostCriticalStatus(['info', 'warning', 'valid'])).toBe('warning');
  });
});
