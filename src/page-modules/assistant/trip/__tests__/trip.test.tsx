import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { tripFixture } from './trip.fixture';
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
import { tripSummary } from '../utils';
import { formatToClock } from '@atb/utils/date';

afterEach(function () {
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

describe('trip', function () {
  describe('trip summary', function () {
    it('should create correct summary', () => {
      const Test = function () {
        const { t, language } = useTranslation();

        const summary = tripSummary(tripFixture, t, language, false, 1);
        return (
          <div data-testid="test-id" aria-label={summary}>
            {summary}
          </div>
        );
      };

      customRender(<Test />, {});

      const ariaLabel = screen
        .getByTestId('test-id')
        .getAttribute('aria-label');

      const startTime = formatToClock(
        tripFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Reiseresultat 1.\nBuss fra From 1.\nBussnummer 1.\nKlokken ${startTime}.\nIngen bytter.\nTotalt 0 meter å gå.` +
        `\nStart klokken ${startTime}, ankomst klokken ${endTime}. Total reisetid 1 time.`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary in English', () => {
      const Test = function () {
        const { t, language } = useTranslation();

        const summary = tripSummary(tripFixture, t, language, false, 1);
        return (
          <div data-testid="test-id" aria-label={summary}>
            {summary}
          </div>
        );
      };

      customRender(<Test />, {
        providerProps: {
          initialCookies: {
            darkmode: false,
            language: 'en-US',
          },
        },
      });

      const ariaLabel = screen
        .getByTestId('test-id')
        .getAttribute('aria-label');

      const startTime = formatToClock(
        tripFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Result number 1.\nBus from From 1.\nBus number 1.\nAt ${startTime}.\nNo transfers.\nTotal of 0 meters to walk.` +
        `\nStart time ${startTime}, arrival time ${endTime}. Total travel time 1 hour`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary in nynorsk', () => {
      const Test = function () {
        const { t, language } = useTranslation();

        const summary = tripSummary(tripFixture, t, language, false, 1);
        return (
          <div data-testid="test-id" aria-label={summary}>
            {summary}
          </div>
        );
      };

      customRender(<Test />, {
        providerProps: {
          initialCookies: {
            darkmode: false,
            language: 'nn',
          },
        },
      });

      const ariaLabel = screen
        .getByTestId('test-id')
        .getAttribute('aria-label');

      const startTime = formatToClock(
        tripFixture.expectedStartTime,
        Language.Norwegian,
      );
      const endTime = formatToClock(
        tripFixture.expectedEndTime,
        Language.Norwegian,
      );

      const expected =
        `Reiseresultat 1.\nBuss frå From 1.\nBussnummer 1.\nKlokka ${startTime}.\nIngen bytter.\nTotalt 0 meter å gå.` +
        `\nStart klokka ${startTime}, framkomst klokka ${endTime}. Total reisetid 1 time.`;

      expect(ariaLabel).toBe(expected);
    });

    it('should create summary with trip in the past', () => {
      const Test = function () {
        const { t, language } = useTranslation();

        const summary = tripSummary(tripFixture, t, language, true, 1);
        return (
          <div data-testid="test-id" aria-label={summary}>
            {summary}
          </div>
        );
      };

      customRender(<Test />, {});

      const ariaLabel = screen
        .getByTestId('test-id')
        .getAttribute('aria-label');

      const expected = 'Passert reise';

      expect(ariaLabel).toContain(expected);
    });

    it('should create summary with correct result number', () => {
      const Test = function () {
        const { t, language } = useTranslation();

        const summary = tripSummary(tripFixture, t, language, true, 5);
        return (
          <div data-testid="test-id" aria-label={summary}>
            {summary}
          </div>
        );
      };

      customRender(<Test />, {});

      const ariaLabel = screen
        .getByTestId('test-id')
        .getAttribute('aria-label');

      const expected = 'Reiseresultat 5';

      expect(ariaLabel).toContain(expected);
    });
  });
});
