import { describe, expect, it } from 'vitest';
import { nextDisplayedDeparture } from '../utils';
import { arrivalRoundingMethod } from '@atb/utils/date';
import { Mode } from '@atb/modules/graphql-types';

const at = (clock: string) => `2024-06-01T${clock}+02:00`;

type TestLeg = {
  mode: Mode;
  expectedStartTime: string;
  expectedEndTime: string;
};
const transit = (start: string, end: string): TestLeg => ({
  mode: Mode.Bus,
  expectedStartTime: at(start),
  expectedEndTime: at(end),
});
const walk = (start: string, end: string): TestLeg => ({
  mode: Mode.Foot,
  expectedStartTime: at(start),
  expectedEndTime: at(end),
});

describe('nextDisplayedDeparture', () => {
  it('uses the next leg when it is transit', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      transit('15:17:34', '15:30:00'),
    ];
    expect(nextDisplayedDeparture(legs, 0)).toBe(at('15:17:34'));
  });

  it('skips an intermediate walk, which shows no departure row', () => {
    // The walk is anchored to start exactly at the arrival, so using it would
    // compare the arrival against itself.
    const legs = [
      transit('15:00:00', '15:17:11'),
      walk('15:17:11', '15:19:00'),
      transit('15:22:40', '15:40:00'),
    ];
    expect(nextDisplayedDeparture(legs, 0)).toBe(at('15:22:40'));
  });

  it('skips consecutive walks', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      walk('15:17:11', '15:18:00'),
      walk('15:18:00', '15:19:00'),
      transit('15:22:40', '15:40:00'),
    ];
    expect(nextDisplayedDeparture(legs, 0)).toBe(at('15:22:40'));
  });

  it('returns undefined for a trailing walk', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      walk('15:17:11', '15:25:00'),
    ];
    expect(nextDisplayedDeparture(legs, 0)).toBeUndefined();
  });

  it('returns undefined on the last leg', () => {
    const legs = [transit('15:00:00', '15:17:11')];
    expect(nextDisplayedDeparture(legs, 0)).toBeUndefined();
  });
});

describe('arrival rounding over whole trips', () => {
  const roundingFor = (legs: TestLeg[], index: number) =>
    arrivalRoundingMethod(
      legs[index].expectedEndTime,
      nextDisplayedDeparture(legs, index),
    );

  it('floors only a same-minute transfer between transit legs', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      transit('15:17:34', '15:30:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('floor');
  });

  it('does not floor when a walk follows, however delayed the arrival', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      walk('15:17:11', '15:19:00'),
      transit('15:22:40', '15:40:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('ceil');
  });

  it('does not floor before a trailing walk', () => {
    const legs = [
      transit('15:00:00', '15:17:11'),
      walk('15:17:11', '15:25:00'),
    ];
    expect(roundingFor(legs, 0)).toBe('ceil');
  });
});
