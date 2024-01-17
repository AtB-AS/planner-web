import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import TransportModeFilter from '../filter';
import { filter } from './filter.fixture';

afterEach(() => cleanup());

describe('transport mode filter', () => {
  it('should render', () => {
    render(
      <TransportModeFilter
        filterState={null}
        onChange={() => {}}
        data={filter}
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
        filterState={null}
        onChange={() => {}}
        data={filter}
      />,
    );

    screen.getAllByRole('checkbox').forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it('should default select only bus', () => {
    render(
      <TransportModeFilter
        filterState={['bus']}
        onChange={() => {}}
        data={filter}
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
        filterState={null}
        onChange={onChange}
        data={filter}
      />,
    );

    screen.getByRole('checkbox', { name: /alle/i }).click();
    expect(onChange).toHaveBeenCalled();
  });

  it('should uncheck all when clicking "All"', () => {
    const onChange = vi.fn();
    const initialState = null;
    const expected: string[] = [];

    render(
      <TransportModeFilter
        filterState={initialState}
        onChange={onChange}
        data={filter}
      />,
    );

    screen.getByRole('checkbox', { name: /alle/i }).click();
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should only check "Bus" when "All" is selected', () => {
    const onChange = vi.fn();
    const initialState = null;
    const expected = ['bus'];

    render(
      <TransportModeFilter
        filterState={initialState}
        onChange={onChange}
        data={filter}
      />,
    );

    screen.getByRole('checkbox', { name: /^buss$/i }).click();
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should check "Rail" when only "Bus" is selected', () => {
    const onChange = vi.fn();
    const initialState = ['bus'];
    const expected = ['bus', 'rail'];

    render(
      <TransportModeFilter
        filterState={initialState}
        onChange={onChange}
        data={filter}
      />,
    );

    screen.getByRole('checkbox', { name: /^tog$/i }).click();
    expect(onChange).toHaveBeenCalledWith(expected);
  });

  it('should check all when all initially are unchecked', async () => {
    const onChange = vi.fn();

    const initial: string[] = [];

    const expected = null;

    render(
      <TransportModeFilter
        filterState={initial}
        onChange={onChange}
        data={filter}
      />,
    );

    const all = screen.getByRole('checkbox', { name: /alle/i });

    await userEvent.click(all);
    expect(onChange).toHaveBeenCalledWith(expected);
  });
});
