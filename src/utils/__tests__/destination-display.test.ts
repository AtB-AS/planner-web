import { describe, expect, it } from 'vitest';
import { Language, TranslateFunction } from '@atb/translations';
import { formatDestinationDisplay } from '../destination-display';

const t: TranslateFunction = (arg) => arg[Language.Norwegian];

describe('formatDestinationDisplay', () => {
  it('returns undefined without a destination display', () => {
    expect(formatDestinationDisplay(t, undefined)).toBeUndefined();
  });

  it('returns undefined without a front text, so callers can fall back', () => {
    expect(formatDestinationDisplay(t, { via: ['Ila'] })).toBeUndefined();
  });

  it('returns the front text alone when there are no via-names', () => {
    expect(formatDestinationDisplay(t, { frontText: 'Pirbadet' })).toBe(
      'Pirbadet',
    );
    expect(
      formatDestinationDisplay(t, { frontText: 'Pirbadet', via: [] }),
    ).toBe('Pirbadet');
  });

  it('appends a single via-name', () => {
    expect(
      formatDestinationDisplay(t, { frontText: 'Pirbadet', via: ['Ila'] }),
    ).toBe('Pirbadet via Ila');
  });

  it('ignores null via-entries the schema allows but the types hide', () => {
    expect(
      formatDestinationDisplay(t, {
        frontText: 'Pirbadet',
        via: ['Ila', null, 'Lade'] as unknown as string[],
      }),
    ).toBe('Pirbadet via Ila og Lade');
  });

  it('joins several via-names with commas and a concat word', () => {
    expect(
      formatDestinationDisplay(t, {
        frontText: 'Pirbadet',
        via: ['Ila', 'Sentrum', 'Lade'],
      }),
    ).toBe('Pirbadet via Ila, Sentrum og Lade');
  });
});
