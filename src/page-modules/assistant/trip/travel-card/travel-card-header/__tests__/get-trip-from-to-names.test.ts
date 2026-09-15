import { describe, expect, it } from 'vitest';
import { Language, TranslateFunction } from '@atb/translations';
import { Mode } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';
import {
  ExtendedLegType,
  ExtendedTripPatternWithDetailsType,
} from '@atb/page-modules/assistant';
import { getTripFromToNames } from '../utils';
import { tripPatternWithDetailsFixture } from '../../__tests__/trip-pattern.fixture';

const t: TranslateFunction = (arg) => arg[Language.Norwegian];

const baseLeg = tripPatternWithDetailsFixture.legs[0];

const quay = (name: string, publicCode: string) => ({
  id: `NSR:Quay:${publicCode}`,
  name,
  publicCode,
  situations: [],
  tariffZones: [],
});

type Place = { name: string; quay?: ReturnType<typeof quay> };

/** A place with no `quay` really has none — the fixture's must not leak in. */
const place = ({ name, quay }: Place) => ({
  ...baseLeg.fromPlace,
  name,
  quay,
});

const leg = (mode: Mode, from: Place, to: Place): ExtendedLegType => ({
  ...baseLeg,
  mode,
  fromPlace: place(from),
  toPlace: place(to),
});

const pattern = (
  legs: ExtendedLegType[],
): ExtendedTripPatternWithDetailsType => ({
  ...tripPatternWithDetailsFixture,
  legs,
});

const prinsensGate = (platform: string) => quay('Prinsens gate', platform);
const lade = quay('Lade', 'P2');

describe('getTripFromToNames', () => {
  it('names the trip from the place you searched from, not the stop you board at', () => {
    const legs = [
      leg(
        Mode.Foot,
        { name: 'Egon Prinsen' },
        { name: 'Prinsens gate', quay: prinsensGate('P1') },
      ),
      leg(
        Mode.Bus,
        { name: 'Prinsens gate', quay: prinsensGate('P1') },
        { name: 'Lade', quay: lade },
      ),
    ];

    expect(getTripFromToNames(pattern(legs), t).fromName).toBe('Egon Prinsen');
  });

  it('uses the quay name when the trip starts by boarding', () => {
    const legs = [
      leg(
        Mode.Bus,
        { name: 'Prinsens gate', quay: prinsensGate('P1') },
        { name: 'Lade', quay: lade },
      ),
    ];

    expect(getTripFromToNames(pattern(legs), t).fromName).toBe(
      'Prinsens gate P1',
    );
  });

  it('keeps the quay name when the first walk starts on a quay', () => {
    const legs = [
      leg(
        Mode.Foot,
        { name: 'Prinsens gate', quay: prinsensGate('P1') },
        { name: 'Prinsens gate', quay: prinsensGate('P3') },
      ),
      leg(
        Mode.Bus,
        { name: 'Prinsens gate', quay: prinsensGate('P3') },
        { name: 'Lade', quay: lade },
      ),
    ];

    expect(getTripFromToNames(pattern(legs), t).fromName).toBe(
      'Prinsens gate P1',
    );
  });

  it('names the destination from the last leg, walk included', () => {
    const legs = [
      leg(
        Mode.Bus,
        { name: 'Prinsens gate', quay: prinsensGate('P1') },
        { name: 'Lade', quay: lade },
      ),
      leg(Mode.Foot, { name: 'Lade', quay: lade }, { name: 'Ladeveien 1' }),
    ];

    expect(getTripFromToNames(pattern(legs), t).toName).toBe('Ladeveien 1');
  });
});
