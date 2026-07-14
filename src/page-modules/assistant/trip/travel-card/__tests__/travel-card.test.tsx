import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { tripPatternFixture } from './trip-pattern.fixture.ts';
import {
  AppCookiesProvider,
  AppCookiesProviderProps,
} from '@atb/modules/cookies/cookies-context';
import React from 'react';
import {
  AppLanguageProvider,
  Language,
  useTranslation,
} from '@atb/translations';
import { formatToClock } from '@atb/utils/date';
import { tripPatternWithDetailsFixture } from './trip-pattern.fixture.ts';
import { tripSummary } from '../../utils.ts';
import { ExtendedTripPatternWithDetailsType } from '@atb/page-modules/assistant';
import { PurchaseWhen } from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

beforeEach(function () {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date('2022-12-31T12:00:00+01:00'));
});

afterEach(function () {
  vi.useRealTimers();
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/assistant']));

type RenderProps = { providerProps?: AppCookiesProviderProps };
const customRender = (
  ui: React.ReactNode,
  {
    providerProps = {
      initialCookies: {
        darkmode: false,
        language: 'no',
      },
    },
    ...renderOptions
  }: RenderProps,
) => {
  return render(
    <AppCookiesProvider {...providerProps}>
      <AppLanguageProvider serverAcceptLanguage="">{ui}</AppLanguageProvider>
    </AppCookiesProvider>,
    renderOptions,
  );
};

const renderSummary = (
  tripPattern: ExtendedTripPatternWithDetailsType,
  listPosition: number = 1,
  providerProps?: AppCookiesProviderProps,
) => {
  const Test = function () {
    const { t, language } = useTranslation();

    const summary = tripSummary(tripPattern, t, language, listPosition);
    return (
      <div data-testid="test-id" aria-label={summary}>
        {summary}
      </div>
    );
  };

  customRender(<Test />, providerProps ? { providerProps } : {});

  return screen.getByTestId('test-id').getAttribute('aria-label');
};

describe('trip pattern', function () {
  describe('trip summary', function () {
    it('should create correct summary', () => {
      const ariaLabel = renderSummary(tripPatternWithDetailsFixture);

      const startTime = formatToClock(
        tripPatternFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripPatternFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Reiseresultat 1.\nBuss fra From 1.\nBussnummer 1.\nKlokken ${startTime}.\nIngen bytter.\nTotalt 0 meter å gå.` +
        `\nStart klokken ${startTime}, ankomst klokken ${endTime}. Total reisetid 1 time.`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary in English', () => {
      const ariaLabel = renderSummary(tripPatternWithDetailsFixture, 1, {
        initialCookies: {
          darkmode: false,
          language: 'en-US',
        },
      });

      const startTime = formatToClock(
        tripPatternFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripPatternFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Result number 1.\nBus from From 1.\nBus number 1.\nAt ${startTime}.\nNo transfers.\nTotal of 0 meters to walk.` +
        `\nStart time ${startTime}, arrival time ${endTime}. Total travel time 1 hour`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary in nynorsk', () => {
      const ariaLabel = renderSummary(tripPatternWithDetailsFixture, 1, {
        initialCookies: {
          darkmode: false,
          language: 'nn',
        },
      });

      const startTime = formatToClock(
        tripPatternFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripPatternFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Reiseresultat 1.\nBuss frå From 1.\nBussnummer 1.\nKlokka ${startTime}.\nIngen byte.\nTotalt 0 meter å gå.` +
        `\nStart klokka ${startTime}, framkomst klokka ${endTime}. Total reisetid 1 time.`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary with information about started trip', () => {
      vi.setSystemTime(new Date('2023-01-01T01:30:00+01:00'));

      const ariaLabel = renderSummary(tripPatternWithDetailsFixture);

      expect(ariaLabel).toContain('Reisen har startet');
    });

    it('should create summary with information about ended trip', () => {
      vi.setSystemTime(new Date('2023-01-02T12:00:00+01:00'));

      const ariaLabel = renderSummary(tripPatternWithDetailsFixture);

      expect(ariaLabel).toContain('Reisen er ferdig');
    });

    it('should create summary with correct result number', () => {
      const ariaLabel = renderSummary(tripPatternWithDetailsFixture, 5);

      expect(ariaLabel).toContain('Reiseresultat 5');
    });

    it('should create summary with information about cancelled trip', () => {
      const cancelledTripPattern = {
        ...tripPatternWithDetailsFixture,
        legs: [
          {
            ...tripPatternWithDetailsFixture.legs[0],
            fromEstimatedCall: {
              notices: [],
              cancellation: true,
            },
          },
        ],
      };

      const ariaLabel = renderSummary(cancelledTripPattern);

      expect(ariaLabel).toContain('Denne reisen er innstilt');
    });

    it('should create summary with information about impossible trip', () => {
      const ariaLabel = renderSummary({
        ...tripPatternWithDetailsFixture,
        status: 'impossible',
      });

      expect(ariaLabel).toContain('Ikke mulig');
    });

    it('should create summary with information about stale trip', () => {
      const ariaLabel = renderSummary({
        ...tripPatternWithDetailsFixture,
        status: 'stale',
      });

      expect(ariaLabel).toContain('Resultatene kan være utdaterte');
    });

    it('should create summary with information about required booking', () => {
      const bookingTripPattern = {
        ...tripPatternWithDetailsFixture,
        legs: [
          {
            ...tripPatternWithDetailsFixture.legs[0],
            bookingArrangements: {},
          },
        ],
      };

      const ariaLabel = renderSummary(bookingTripPattern);

      expect(ariaLabel).toContain('Krever bestilling');
    });

    it('should create summary with information about exceeded booking deadline', () => {
      const bookingTripPattern = {
        ...tripPatternWithDetailsFixture,
        legs: [
          {
            ...tripPatternWithDetailsFixture.legs[0],
            bookingArrangements: {
              bookWhen: PurchaseWhen.UntilPreviousDay,
              latestBookingTime: '10:00:00',
            },
          },
        ],
      };

      const ariaLabel = renderSummary(bookingTripPattern);

      expect(ariaLabel).toContain('Bestillingsfristen er passert');
    });

    it('should create summary with original times when expected times differ', () => {
      const delayedTripPattern = {
        ...tripPatternWithDetailsFixture,
        legs: [
          {
            ...tripPatternWithDetailsFixture.legs[0],
            aimedStartTime: '2023-01-01T00:45:00+01:00',
          },
        ],
      };

      const ariaLabel = renderSummary(delayedTripPattern);

      const aimedStartTime = formatToClock(
        '2023-01-01T00:45:00+01:00',
        Language.Norwegian,
      );
      expect(ariaLabel).toContain(
        `Opprinnelig start klokken ${aimedStartTime}`,
      );
    });

    it('should not include original times when they match expected times', () => {
      const ariaLabel = renderSummary(tripPatternWithDetailsFixture);

      expect(ariaLabel).not.toContain('Opprinnelig');
    });
  });
});
