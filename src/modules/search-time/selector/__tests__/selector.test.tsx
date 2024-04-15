import { cleanup, render, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { addDays, addHours, format, subDays } from 'date-fns';
import SearchTimeSelector from '..';

afterEach(function () {
  cleanup();
});

describe('search time selector', function () {
  it('should default to "Now"', async () => {
    const output = render(<SearchTimeSelector onChange={() => {}} />);

    expect(
      output.getByRole('radio', {
        name: 'Nå',
      }),
    ).toBeChecked();
  });

  it('should not show date and time selector when "Now" is selected', async () => {
    const output = render(<SearchTimeSelector onChange={() => {}} />);

    expect(output.queryByText('Dato')).not.toBeInTheDocument();
    expect(output.queryByText('Tid')).not.toBeInTheDocument();
  });

  it('should use initialState for default selected', async () => {
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    expect(
      output.getByRole('radio', {
        name: 'Ankomst',
      }),
    ).toBeChecked();
  });

  it('should show date and time selector when "Arrival" is selected', async () => {
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    expect(output.queryByText('Dato')).toBeInTheDocument();
    expect(output.queryByText('Tid')).toBeInTheDocument();
  });

  it('should show date and time selector when "Departure" is selected', async () => {
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'departBy', dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    expect(output.queryByText('Dato')).toBeInTheDocument();
    expect(output.queryByText('Tid')).toBeInTheDocument();
  });

  it('should change selection with keyboard', async () => {
    const output = render(<SearchTimeSelector onChange={() => {}} />);

    const radio = output.getByRole('radio', { name: 'Nå' });
    radio.focus();
    expect(radio).toHaveFocus();

    // {ArrowRight} does not work
    await userEvent.type(radio, '{ArrowDown}');

    expect(
      output.getByRole('radio', {
        name: 'Avreise',
      }),
    ).toBeChecked();
  });

  it('should change selection when clicked', async () => {
    const output = render(<SearchTimeSelector onChange={() => {}} />);

    const radio = output.getByRole('radio', {
      name: 'Ankomst',
    });

    expect(radio).not.toBeChecked();

    await userEvent.click(radio);

    expect(radio).toBeChecked();
  });

  it('should call onStateChange', async () => {
    const onStateChange = vi.fn();
    const output = render(<SearchTimeSelector onChange={onStateChange} />);

    output.getByRole('radio', { name: 'Ankomst' }).click();

    expect(onStateChange).toHaveBeenCalled();
  });

  it('should call onChange when date changes', async () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={onChange}
      />,
    );

    const date = output.getByLabelText('Dato');

    fireEvent.change(date, { target: { value: '2100-01-01' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('should call onChange when time changes', async () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={onChange}
      />,
    );

    const time = output.getByLabelText('Tid');

    const newTime = format(addHours(new Date(), 1), 'HH:mm');

    fireEvent.change(time, { target: { value: newTime } });

    expect(time).toHaveValue(newTime);
    expect(onChange).toHaveBeenCalled();
  });

  it('should not show arriveBy', () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'now' }}
        onChange={onChange}
        options={['now', 'departBy']}
      />,
    );

    expect(
      output.queryByRole('radio', {
        name: 'Ankomst',
      }),
    ).not.toBeInTheDocument();

    expect(
      output.queryByRole('radio', {
        name: 'Nå',
      }),
    ).toBeInTheDocument();

    expect(
      output.queryByRole('radio', {
        name: 'Avreise',
      }),
    ).toBeInTheDocument();
  });

  it('should allow call onChange when selecting yesterday as date input.', () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={onChange}
      />,
    );
    const dateInput = output.getByLabelText('Dato');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    fireEvent.change(dateInput, { target: { value: yesterday } });

    expect(onChange).toHaveBeenCalled();
  });

  it('should not call onChange when selecting the day before yesterday as date input.', () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={onChange}
      />,
    );
    const dateInput = output.getByLabelText('Dato');
    const yesterday = format(subDays(new Date(), 2), 'yyyy-MM-dd');

    fireEvent.change(dateInput, { target: { value: yesterday } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should allow call onChange when selecting today as date input.', () => {
    const onChange = vi.fn();
    const output = render(
      <SearchTimeSelector
        initialState={{ mode: 'arriveBy', dateTime: 0 }}
        onChange={onChange}
      />,
    );
    const dateInput = output.getByLabelText('Dato');
    const today = format(new Date(), 'yyyy-MM-dd');

    fireEvent.change(dateInput, { target: { value: today } });

    expect(onChange).toHaveBeenCalled();
  });
});
