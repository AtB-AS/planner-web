import { describe, it, expect } from 'vitest';
import { isSituationValidAtDate } from '../utils'; // Adjust the path if needed
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip.generated.ts'; // Adjust the path if needed

const dummySituation: SituationFragment = {
  id: '1',
  situationNumber: '12345',
  reportType: undefined,
  summary: [
    { language: 'en', value: 'Summary text in English' },
    { language: 'es', value: 'Texto de resumen en español' },
  ],
  description: [
    { language: 'en', value: 'Description text in English' },
    { language: 'fr', value: 'Texte de description en français' },
  ],
  advice: [
    { language: 'en', value: 'Advice text in English' },
    { language: 'de', value: 'Ratentext auf Deutsch' },
  ],
  infoLinks: undefined,
  validityPeriod: {
    startTime: '2024-11-21T00:00:00+01:00',
    endTime: '2024-11-23T23:59:59+01:00',
  },
};

describe('isSituationValidAtDate', () => {
  it('returns true if the date is between the startTime and endTime', () => {
    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(dummySituation);
    expect(result).toBe(true);
  });

  it('returns false if the date is before the startTime', () => {
    const date = '2024-11-20T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(dummySituation);
    expect(result).toBe(false);
  });

  it('returns false if the date is after the endTime', () => {
    const date = '2024-11-24T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(dummySituation);
    expect(result).toBe(false);
  });

  it('returns true if only startTime exists and date is after startTime', () => {
    const situationWithStartOnly: SituationFragment = {
      ...dummySituation,
      validityPeriod: {
        startTime: '2024-11-21T00:00:00+01:00',
        endTime: undefined,
      },
    };

    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithStartOnly);
    expect(result).toBe(true);
  });

  it('returns true if only endTime exists and date is before endTime', () => {
    const situationWithEndOnly: SituationFragment = {
      ...dummySituation,
      validityPeriod: {
        startTime: undefined,
        endTime: '2024-11-23T23:59:59+01:00',
      },
    };
    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithEndOnly);
    expect(result).toBe(true);
  });

  it('returns true if both startTime and endTime are null', () => {
    const situationWithNoValidityPeriod: SituationFragment = {
      ...dummySituation,
      validityPeriod: {
        startTime: undefined,
        endTime: undefined,
      },
    };
    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithNoValidityPeriod);
    expect(result).toBe(true);
  });

  it('returns true if no validityPeriod is provided', () => {
    const situationWithoutValidityPeriod: SituationFragment = {
      ...dummySituation,
      validityPeriod: undefined,
    };

    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithoutValidityPeriod);
    expect(result).toBe(true);
  });
});
