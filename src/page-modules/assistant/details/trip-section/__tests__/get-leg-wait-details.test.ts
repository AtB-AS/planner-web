import { describe, expect, it } from 'vitest';
import { getLegWaitDetails } from '../wait-section';
import { ExtendedLegType } from '@atb/page-modules/assistant';

const leg = (
  expectedStartTime: string,
  expectedEndTime: string,
  transferRisk?: string,
) => ({ expectedStartTime, expectedEndTime, transferRisk }) as ExtendedLegType;

const arriving = leg('2024-01-01T10:00:00.000Z', '2024-01-01T10:10:00.000Z');

describe('getLegWaitDetails', () => {
  it('counts a zero second transfer as a wait, so it gets a message', () => {
    const next = leg('2024-01-01T10:10:00.000Z', '2024-01-01T10:20:00.000Z');
    const details = getLegWaitDetails(arriving, next);
    expect(details?.waitTime).toBe(0);
    expect(details?.mustWaitForNextLeg).toBe(true);
  });

  it('counts an ordinary wait', () => {
    const next = leg('2024-01-01T10:11:00.000Z', '2024-01-01T10:20:00.000Z');
    const details = getLegWaitDetails(arriving, next);
    expect(details?.waitTime).toBe(60);
    expect(details?.mustWaitForNextLeg).toBe(true);
  });

  it('is not a wait when the connection has already left', () => {
    const next = leg('2024-01-01T10:09:00.000Z', '2024-01-01T10:20:00.000Z');
    const details = getLegWaitDetails(arriving, next);
    expect(details?.waitTime).toBe(-60);
    expect(details?.mustWaitForNextLeg).toBe(false);
  });

  it('reads the risk off the leg being boarded', () => {
    const next = leg(
      '2024-01-01T10:09:00.000Z',
      '2024-01-01T10:20:00.000Z',
      'uncertain',
    );
    expect(getLegWaitDetails(arriving, next)?.transferRisk).toBe('uncertain');
  });

  it('is undefined on the last leg', () => {
    expect(
      getLegWaitDetails(arriving, undefined as unknown as ExtendedLegType),
    ).toBeUndefined();
  });
});
