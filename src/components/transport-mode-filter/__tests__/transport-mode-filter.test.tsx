import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TransportModeFilter from '@atb/components/transport-mode-filter';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import userEvent from '@testing-library/user-event';
import { TransportModeFilterState } from '@atb/components/transport-mode-filter/types';

afterEach(() => cleanup());

describe('transport mode filter', () => {
  it('should render', () => {
    render(
      <TransportModeFilter
        filterState={getInitialTransportModeFilter()}
        onFilterChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('checkbox', {
        name: /alle/i,
      }),
    ).toBeInTheDocument();
  });

  it('should default select all', () => {
    render(
      <TransportModeFilter
        filterState={getInitialTransportModeFilter()}
        onFilterChange={() => {}}
      />,
    );

    screen.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it('should default select only bus', () => {
    render(
      <TransportModeFilter
        filterState={getInitialTransportModeFilter(['bus'])}
        onFilterChange={() => {}}
      />,
    );

    expect(screen.getByRole('checkbox', { name: /alle/i })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /^buss$/i })).toBeChecked();
    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1);
  });

  it('should call onChange when clicking a checkbox', () => {
    const onChange = vi.fn();

    render(
      <TransportModeFilter
        filterState={getInitialTransportModeFilter()}
        onFilterChange={onChange}
      />,
    );

    screen.getByRole('checkbox', { name: /alle/i }).click();
    expect(onChange).toHaveBeenCalled();
  });

  it('should uncheck all when clicking "All"', () => {
    const onChange = vi.fn();
    const initialState = getInitialTransportModeFilter();
    const expected: TransportModeFilterState = {
      air: false,
      airportbus: false,
      bus: false,
      expressboat: false,
      ferry: false,
      other: false,
      rail: false,
    };

    render(
      <TransportModeFilter
        filterState={initialState}
        onFilterChange={onChange}
      />,
    );

    screen.getByRole('checkbox', { name: /alle/i }).click();
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should only uncheck "Bus"', () => {
    const onChange = vi.fn();
    const initialState = getInitialTransportModeFilter();
    const expected: TransportModeFilterState = {
      ...initialState,
      bus: false,
    };

    render(
      <TransportModeFilter
        filterState={initialState}
        onFilterChange={onChange}
      />,
    );

    screen.getByRole('checkbox', { name: /^buss$/i }).click();
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should check all when all initially are unchecked', async () => {
    const onChange = vi.fn();

    const initial: TransportModeFilterState = {
      air: false,
      airportbus: false,
      bus: false,
      expressboat: false,
      ferry: false,
      other: false,
      rail: false,
    };

    const expected: TransportModeFilterState = {
      air: true,
      airportbus: true,
      bus: true,
      expressboat: true,
      ferry: true,
      other: true,
      rail: true,
    };

    render(
      <TransportModeFilter filterState={initial} onFilterChange={onChange} />,
    );

    const all = screen.getByRole('checkbox', { name: /alle/i });

    await userEvent.click(all);
    expect(onChange).toHaveBeenCalledWith(expected);
  });
});