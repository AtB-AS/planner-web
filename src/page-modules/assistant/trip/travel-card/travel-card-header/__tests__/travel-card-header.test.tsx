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

  it('should render the from-to row as a level 2 heading when includeFromToInfo is set', async () => {
    render(
      <TravelCardHeader
        tripPattern={tripPatternWithDetailsFixture}
        size="large"
        includeFromToInfo
      />,
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'From 1 - To 2',
    );
  });

  it('should not render a heading or from-to row by default', async () => {
    render(<TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('fromToRow')).not.toBeInTheDocument();
  });

  it('should prefix the start time with the date when includeDayInfo is set and the trip is not today', async () => {
    render(
      <TravelCardHeader
        tripPattern={tripPatternWithDetailsFixture}
        includeDayInfo
      />,
    );

    expect(screen.getByTestId('expectedTimeRange')).toHaveTextContent(
      '1. januar, 01:00 - 02:00',
    );
  });

  it('should not prefix the start time with the date by default', async () => {
    render(<TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />);

    expect(screen.getByTestId('expectedTimeRange')).toHaveTextContent(
      /^01:00 - 02:00$/,
    );
  });

  it('should not render the duration when includeDuration is false', async () => {
    render(
      <TravelCardHeader
        tripPattern={tripPatternWithDetailsFixture}
        includeDuration={false}
      />,
    );

    expect(screen.queryByTestId('resultDuration')).not.toBeInTheDocument();
  });

  it('should provide a screen reader label for the time range', async () => {
    render(<TravelCardHeader tripPattern={tripPatternWithDetailsFixture} />);

    expect(screen.getByTestId('expectedTimeRange')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByText('Fra 01:00 til 02:00')).toBeInTheDocument();
  });

  it('should announce new and original times when the trip is delayed', async () => {
    const delayedTripPattern = {
      ...tripPatternWithDetailsFixture,
      legs: [
        {
          ...tripPatternWithDetailsFixture.legs[0],
          aimedStartTime: '2023-01-01T00:45:00+01:00',
        },
      ],
    };

    render(<TravelCardHeader tripPattern={delayedTripPattern} />);

    expect(screen.getByText('Ny tid fra 01:00 til 02:00')).toBeInTheDocument();
    expect(
      screen.getByText('Opprinnelig fra 00:45 til 02:00'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('aimedTimeRange')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
