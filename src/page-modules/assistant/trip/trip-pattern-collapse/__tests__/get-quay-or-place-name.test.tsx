import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppLanguageProvider, useTranslation } from '@atb/translations';
import { getQuayOrPlaceName } from '../../utils.ts';
import mockRouter from 'next-router-mock';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { AppCookiesProviderProps } from '@atb/modules/cookies/cookies-context.tsx';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { AppCookiesProvider } from '@atb/modules/cookies';
import { tripPatternFixture } from './trip-pattern.fixture.ts';

afterEach(function () {
  cleanup();
});

vi.mock('next/router', () => require('next-router-mock'));

mockRouter.useParser(createDynamicRouteParser(['/assistant']));

type RenderProps = { providerProps: AppCookiesProviderProps };
const customRender = (
  ui: React.ReactNode,
  { providerProps, ...renderOptions }: RenderProps,
) => {
  return render(
    <AppCookiesProvider {...providerProps}>
      <AppLanguageProvider serverAcceptLanguage="">{ui}</AppLanguageProvider>
    </AppCookiesProvider>,
    renderOptions,
  );
};

describe('getQuayOrPlaceName', () => {
  it('should get quay name from quay', () => {
    const Test = function () {
      const { t } = useTranslation();
      const quayName = getQuayOrPlaceName(
        t,
        {
          publicCode: '',
          name: 'Quay',
          description: undefined,
          id: 'NSR:Quay:1',
          situations: [],
          tariffZones: [],
        },
        'PlaceName',
      );
      return <div>{quayName}</div>;
    };

    customRender(<Test />, {
      providerProps: {
        initialCookies: {
          darkmode: false,
          language: 'no',
        },
      },
    });

    expect(screen.getByText('Quay')).toBeInTheDocument();
  });

  it('should get quay name with public code from quay', () => {
    const Test = function () {
      const { t } = useTranslation();
      const quayName = getQuayOrPlaceName(
        t,
        {
          publicCode: '1',
          name: 'Quay',
          description: undefined,
          id: 'NSR:Quay:1',
          situations: [],
          tariffZones: [],
        },
        'PlaceName',
      );
      return <div>{quayName}</div>;
    };

    customRender(<Test />, {
      providerProps: {
        initialCookies: {
          darkmode: false,
          language: 'no',
        },
      },
    });

    expect(screen.getByText('Quay 1')).toBeInTheDocument();
  });

  it('should get quay name from trip', () => {
    const Test = function () {
      const { t } = useTranslation();
      const quayName = getQuayOrPlaceName(
        t,
        tripPatternFixture.legs[0].fromPlace.quay,
        tripPatternFixture.legs[0].fromPlace.name,
      );
      return <div>{quayName}</div>;
    };

    customRender(<Test />, {
      providerProps: {
        initialCookies: {
          darkmode: false,
          language: 'no',
        },
      },
    });

    expect(screen.getByText('From 1')).toBeInTheDocument();
  });

  it('should use place name if quay is not available from trip', () => {
    const Test = function () {
      const { t } = useTranslation();
      const quayName = getQuayOrPlaceName(
        t,
        undefined,
        tripPatternFixture.legs[0].fromPlace.name,
      );
      return <div>{quayName}</div>;
    };

    customRender(<Test />, {
      providerProps: {
        initialCookies: {
          darkmode: false,
          language: 'no',
        },
      },
    });

    expect(screen.getByText('FromPlaceName')).toBeInTheDocument();
  });
});
