import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DepartureTime } from '../';
import { addMinutes } from 'date-fns';
import { formatLocaleTime } from '@atb/utils/date';
import { Language } from '@atb/translations';

afterEach(function () {
  cleanup();
  vi.useRealTimers();
});

describe('departure time component', function () {
  it('should render time if expected equal to aimed', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:00:00+02:00"
      />,
    );

    expect(output.getByLabelText('Rutetid 12:00')).toBeInTheDocument();
  });

  it('should not show strike through time if no significant change when realtime', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:00:30+02:00"
        realtime
      />,
    );
    expect(output.getByLabelText('Sanntid 12:00')).toBeInTheDocument();
    expect(output.queryByText('12:00')).not.toHaveClass(
      'body__tertiary--strike',
    );
  });

  it('should render aimed if realtime not active, even on delays', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
      />,
    );

    expect(output.getByLabelText('Rutetid 12:00')).toBeInTheDocument();
    expect(output.queryByLabelText('Sanntid 12:05')).toBeNull();
  });

  it('should render expected if realtime is active if delay', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        realtime
      />,
    );
    expect(output.getByLabelText('Rutetid 12:00')).toBeInTheDocument();
    expect(output.getByLabelText('Rutetid 12:00')).toHaveClass(
      'typo-body__tertiary--strike',
    );
    expect(output.getByLabelText('Sanntid 12:05')).toBeInTheDocument();
  });

  it('should show realtime indicator if realtime and active', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        realtime
        withRealtimeIndicator
      />,
    );
    expect(output.queryByTestId('rt-indicator')).toBeInTheDocument();
  });

  it('should NOT show realtime indicator if not realtime', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        realtime={false}
        withRealtimeIndicator
      />,
    );
    expect(output.queryByTestId('rt-indicator')).toBeNull();
  });

  it('should NOT show realtime indicator it is not activated', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        realtime
      />,
    );
    expect(output.queryByTestId('rt-indicator')).toBeNull();
  });

  it('should indicate cancelled if cancelled, and not show realtime', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        cancelled
        realtime
      />,
    );
    expect(output.getByText('12:00')).toHaveClass('typo-body__primary--strike');
    expect(output.getByText('12:00').getAttribute('aria-label')).toContain(
      'Avgangen fra denne holdeplassen er kansellert',
    );
    expect(output.queryByLabelText('Sanntid 12:05')).toBeNull();
  });

  it('should show relative time if activated', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date());

    const data = new Date().toISOString();

    const output = render(
      <DepartureTime
        aimedDepartureTime={data}
        expectedDepartureTime={data}
        relativeTime
      />,
    );

    expect(output.getByLabelText('Rutetid Nå')).toBeInTheDocument();
  });

  it.each([[5], [6], [7]])(
    'should show relative time if activated, and difference between realtime and aimed for delay %i',
    (delayInMinutes) => {
      const now = new Date();
      vi.useFakeTimers();
      vi.setSystemTime(new Date());

      const output = render(
        <DepartureTime
          aimedDepartureTime={now.toISOString()}
          expectedDepartureTime={addMinutes(now, delayInMinutes).toISOString()}
          relativeTime
          realtime
        />,
      );

      const expectedLabel = `Rutetid Nå`;

      expect(output.getByLabelText(expectedLabel)).toBeInTheDocument();
      expect(output.getByLabelText(expectedLabel)).toHaveClass(
        'typo-body__tertiary--strike',
      );
      expect(
        output.getByLabelText(`Sanntid ${delayInMinutes} min`),
      ).toBeInTheDocument();
    },
  );

  it('should show clock if in past', () => {
    const now = new Date();
    vi.useFakeTimers();

    // Set time 1 minute in the future (making present time in past :o )
    vi.setSystemTime(addMinutes(new Date(), 1));

    const output = render(
      <DepartureTime
        aimedDepartureTime={now.toISOString()}
        expectedDepartureTime={now.toISOString()}
        relativeTime
      />,
    );

    const expectedLabel = `Rutetid ${formatLocaleTime(
      now,
      Language.Norwegian,
    )}`;

    expect(output.getByLabelText(expectedLabel)).toBeInTheDocument();
  });
});
