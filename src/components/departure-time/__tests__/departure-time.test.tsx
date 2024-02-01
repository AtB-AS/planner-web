import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { DepartureTime } from '../';

afterEach(function () {
  cleanup();
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
});
