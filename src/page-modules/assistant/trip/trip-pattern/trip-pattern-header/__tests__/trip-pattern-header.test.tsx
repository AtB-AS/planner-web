import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { getQuayName, getStartModeAndPlaceText, TripPatternHeader } from '..';
import { tripPatternFixture } from './trip-pattern.fixture';
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

describe('trip pattern header', function () {
  it('should render trip pattern header', async () => {
    render(<TripPatternHeader tripPattern={tripPatternFixture} />);

    expect(screen.getByText('Buss fra From 1')).toBeInTheDocument();
    expect(screen.getByText('1 time')).toBeInTheDocument();
  });

  it('should render trip pattern header in english', async () => {
    customRender(<TripPatternHeader tripPattern={tripPatternFixture} />, {
      providerProps: {
        initialCookies: {
          darkmode: true,
          language: 'en-US',
        },
      },
    });

    expect(screen.getByText('Bus from From 1')).toBeInTheDocument();
    expect(screen.getByText('1 hour')).toBeInTheDocument();
  });

  it('should render trip pattern header in nynorsk', async () => {
    customRender(<TripPatternHeader tripPattern={tripPatternFixture} />, {
      providerProps: {
        initialCookies: {
          darkmode: true,
          language: 'nn',
        },
      },
    });

    expect(screen.getByText('Buss frå From 1')).toBeInTheDocument();
    expect(screen.getByText('1 time')).toBeInTheDocument();
  });

  it('should get quay name from quay', () => {
    const Test = function () {
      const { t } = useTranslation();
      const quayName = getQuayName({
        publicCode: '',
        name: 'Quay',
        description: null,
        id: 'NSR:Quay:1',
        situations: [],
      }, t);
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
      const quayName = getQuayName({
        publicCode: '1',
        name: 'Quay',
        description: null,
        id: 'NSR:Quay:1',
        situations: [],
      }, t);
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
      const quayName = getQuayName(tripPatternFixture.legs[0].fromPlace.quay, t);
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

  it('should get start mode and start place from trip', () => {
    const Test = function () {
      const { t } = useTranslation();

      const startModeAndPlaceText = getStartModeAndPlaceText(
        tripPatternFixture,
        t,
      );
      return <div>{startModeAndPlaceText}</div>;
    };

    customRender(<Test />, {
      providerProps: {
        initialCookies: {
          darkmode: false,
          language: 'no',
        },
      },
    });

    expect(screen.getByText('Buss fra From 1')).toBeInTheDocument();
  });
});
