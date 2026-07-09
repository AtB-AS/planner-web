import { cleanup, render, screen } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';
import { TravelCardHeader } from '..';
import { tripPatternWithDetailsFixture } from '../../__tests__/trip-pattern.fixture';
import {
  AppCookiesProvider,
  AppCookiesProviderProps,
} from '@atb/modules/cookies/cookies-context';
import React from 'react';
import { AppLanguageProvider, useTranslation } from '@atb/translations';

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

describe('travel card header', function () {
  it('should render travel card header with duration and ended status', async () => {
    render(<TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />);

    expect(screen.getByTestId('resultDuration')).toBeInTheDocument();
    expect(screen.getByText('Reisen er ferdig')).toBeInTheDocument();
  });

  it('should render trip pattern header in english', async () => {
    customRender(
      <TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />,
      {
        providerProps: {
          initialCookies: {
            darkmode: true,
            language: 'en-US',
          },
        },
      },
    );

    expect(screen.getByText('Trip ended')).toBeInTheDocument();
  });

  it('should render travel card header in nynorsk', async () => {
    customRender(
      <TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />,
      {
        providerProps: {
          initialCookies: {
            darkmode: true,
            language: 'nn',
          },
        },
      },
    );

    expect(screen.getByText('Reisa er ferdig')).toBeInTheDocument();
  });
});
