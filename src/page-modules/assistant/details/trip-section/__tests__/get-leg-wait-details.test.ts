import { describe, expect, it } from 'vitest';
import { getLegWaitDetails } from '../wait-section';
import { ExtendedLegType } from '@atb/page-modules/assistant';

const at = (time: string) => `2024-01-01T${time}:00.000Z`;

const busLeg = (
  start: string,
  end: string,
  transferRisk?: ExtendedLegType['transferRisk'],
) =>
  ({
    mode: 'bus',
    expectedStartTime: at(start),
    expectedEndTime: at(end),
    transferRisk,
  }) as ExtendedLegType;

const footLeg = (start: string, end: string) =>
  ({
    mode: 'foot',
    expectedStartTime: at(start),
    expectedEndTime: at(end),
  }) as ExtendedLegType;

describe('getLegWaitDetails', () => {
  it('counts a flush transfer between two services as a wait', () => {
    const legs = [busLeg('10:00', '10:10'), busLeg('10:10', '10:20')];
    const details = getLegWaitDetails(legs, 0);
    expect(details?.waitTime).toBe(0);
    expect(details?.mustWaitForNextLeg).toBe(true);
  });

  it('counts an ordinary wait', () => {
    const legs = [busLeg('10:00', '10:10'), busLeg('10:11', '10:20')];
    const details = getLegWaitDetails(legs, 0);
    expect(details?.waitTime).toBe(60);
    expect(details?.mustWaitForNextLeg).toBe(true);
  });

  it('is not a wait when the connection has already left', () => {
    const legs = [busLeg('10:00', '10:10'), busLeg('10:09', '10:20')];
    const details = getLegWaitDetails(legs, 0);
    expect(details?.waitTime).toBe(-60);
    expect(details?.mustWaitForNextLeg).toBe(false);
  });

  it('ignores the flush gap into a walk leg', () => {
    const legs = [busLeg('10:00', '10:10'), footLeg('10:10', '10:14')];
    const details = getLegWaitDetails(legs, 0);
    expect(details?.waitTime).toBe(0);
    expect(details?.mustWaitForNextLeg).toBe(false);
  });

  it('ignores the flush gap out of the walk to your first stop', () => {
    const legs = [footLeg('10:00', '10:10'), busLeg('10:10', '10:20')];
    const details = getLegWaitDetails(legs, 0);
    expect(details?.waitTime).toBe(0);
    expect(details?.mustWaitForNextLeg).toBe(false);
  });

  it('counts a flush gap when the walk is between two services', () => {
    const legs = [
      busLeg('10:00', '10:10'),
      footLeg('10:10', '10:14'),
      busLeg('10:14', '10:20'),
    ];
    const details = getLegWaitDetails(legs, 1);
    expect(details?.waitTime).toBe(0);
    expect(details?.mustWaitForNextLeg).toBe(true);
  });

  it('still counts real waiting before boarding your first service', () => {
    const legs = [footLeg('10:00', '10:10'), busLeg('10:15', '10:20')];
    expect(getLegWaitDetails(legs, 0)?.mustWaitForNextLeg).toBe(true);
  });

  it('still counts real waiting before a walk leg', () => {
    const legs = [busLeg('10:00', '10:10'), footLeg('10:11', '10:14')];
    expect(getLegWaitDetails(legs, 0)?.mustWaitForNextLeg).toBe(true);
  });

  it('reads the risk off the leg being boarded', () => {
    const legs = [
      busLeg('10:00', '10:10'),
      busLeg('10:09', '10:20', 'uncertain'),
    ];
    expect(getLegWaitDetails(legs, 0)?.transferRisk).toBe('uncertain');
  });

  it('is undefined on the last leg', () => {
    expect(getLegWaitDetails([busLeg('10:00', '10:10')], 0)).toBeUndefined();
  });
});
