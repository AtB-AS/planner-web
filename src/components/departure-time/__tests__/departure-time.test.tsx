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

    expect(output.getByText('12:00')).toBeInTheDocument();
  });

  it('should render aimed if realtime not active, even on delays', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
      />,
    );

    expect(output.getByText('12:00')).toBeInTheDocument();
    expect(output.getByText('12:00')).not.toHaveStyle({
      textDecorationLine: 'line-through',
    });
    expect(output.queryByText('12:05')).toBeNull();
  });

  it('should render expected if realtime is active if delay', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        realtime
      />,
    );

    expect(output.getByText('12:00')).toHaveStyle({
      textDecorationLine: 'line-through',
    });
    expect(output.getByText('12:05')).toBeInTheDocument();
  });

  it('should indicate cancelled if cancelled if no realtime', () => {
    const output = render(
      <DepartureTime
        aimedDepartureTime="2021-09-01T12:00:00+02:00"
        expectedDepartureTime="2021-09-01T12:05:00+02:00"
        cancelled
      />,
    );

    expect(output.getByText('12:00')).toHaveStyle({
      textDecorationLine: 'line-through',
    });
  });
});
