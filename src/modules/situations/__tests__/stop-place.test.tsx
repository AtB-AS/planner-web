import { describe, it, expect } from 'vitest';
import { isSituationValidAtDate } from '../utils'; // Adjust the path if needed
import { Situation } from '../types'; // Adjust the path if needed

const dummySituation: Situation = {
  id: '1',
  situationNumber: '12345',
  reportType: null,
  summary: [
    { lang: 'en', value: 'Summary text in English' },
    { language: 'es', value: 'Texto de resumen en español' },
  ],
  description: [
    { lang: 'en', value: 'Description text in English' },
    { language: 'fr', value: 'Texte de description en français' },
  ],
  advice: [
    { lang: 'en', value: 'Advice text in English' },
    { language: 'de', value: 'Ratentext auf Deutsch' },
  ],
  infoLinks: null,
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
    const situationWithStartOnly = {
      ...dummySituation,
      validityPeriod: {
        startTime: '2024-11-21T00:00:00+01:00',
        endTime: null,
      },
    };

    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(
      situationWithStartOnly as Situation,
    );
    expect(result).toBe(true);
  });

  it('returns true if only endTime exists and date is before endTime', () => {
    const situationWithEndOnly = {
      ...dummySituation,
      validityPeriod: {
        startTime: null,
        endTime: '2024-11-23T23:59:59+01:00',
      },
    };
    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithEndOnly);
    expect(result).toBe(true);
  });

  it('returns true if both startTime and endTime are null', () => {
    const situationWithNoValidityPeriod = {
      ...dummySituation,
      validityPeriod: {
        startTime: null,
        endTime: null,
      },
    };
    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithNoValidityPeriod);
    expect(result).toBe(true);
  });

  it('returns true if no validityPeriod is provided', () => {
    const situationWithoutValidityPeriod = {
      ...dummySituation,
      validityPeriod: null,
    };

    const date = '2024-11-22T12:00:00+01:00';
    const result = isSituationValidAtDate(date)(situationWithoutValidityPeriod);
    expect(result).toBe(true);
  });
});
