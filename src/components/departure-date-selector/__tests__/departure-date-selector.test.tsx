import { cleanup, render, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import DepartureDateSelector, {
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import userEvent from '@testing-library/user-event';

afterEach(function () {
  cleanup();
});

describe('departure date selector', function () {
  it('should default to "Now"', async () => {
    const output = render(<DepartureDateSelector onChange={() => {}} />);

    expect(
      output.getByRole('radio', {
        name: 'Nå',
      }),
    ).toBeChecked();
  });

  it('should not show date and time selector when "Now" is selected', async () => {
    const output = render(<DepartureDateSelector onChange={() => {}} />);

    expect(output.queryByText('Dato')).not.toBeInTheDocument();
    expect(output.queryByText('Tid')).not.toBeInTheDocument();
  });

  it('should use initialState for default selected', async () => {
    const output = render(
      <DepartureDateSelector
        initialState={{ type: DepartureDateState.Arrival, dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    output.getByRole('radio', {
      name: 'Ankomst',
    });
  });

  it('should show date and time selector when "Arrival" is selected', async () => {
    const output = render(
      <DepartureDateSelector
        initialState={{ type: DepartureDateState.Arrival, dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    expect(output.queryByText('Dato')).toBeInTheDocument();
    expect(output.queryByText('Tid')).toBeInTheDocument();
  });

  it('should show date and time selector when "Departure" is selected', async () => {
    const output = render(
      <DepartureDateSelector
        initialState={{ type: DepartureDateState.Departure, dateTime: 0 }}
        onChange={() => {}}
      />,
    );

    expect(output.queryByText('Dato')).toBeInTheDocument();
    expect(output.queryByText('Tid')).toBeInTheDocument();
  });

  it('should change selection with keyboard', async () => {
    const output = render(<DepartureDateSelector onChange={() => {}} />);

    const radio = output.getByRole('radio', { name: 'Nå' });
    radio.focus();
    expect(radio).toHaveFocus();

    // {ArrowRight} does not work
    await userEvent.type(radio, '{ArrowDown}');

    expect(
      output.getByRole('radio', {
        name: 'Ankomst',
      }),
    ).toBeChecked();
  });

  it('should change selection when clicked', async () => {
    const output = render(<DepartureDateSelector onChange={() => {}} />);

    const radio = output.getByRole('radio', {
      name: 'Ankomst',
    });

    expect(radio).not.toBeChecked();

    await userEvent.click(radio);

    expect(radio).toBeChecked();
  });

  it('should call onStateChange', async () => {
    const onStateChange = vi.fn();
    const output = render(<DepartureDateSelector onChange={onStateChange} />);

    output.getByRole('radio', { name: 'Ankomst' }).click();

    expect(onStateChange).toHaveBeenCalled();
  });

  it('should call onDateChange', async () => {
    const onChange = vi.fn();
    const output = render(
      <DepartureDateSelector
        initialState={{ type: DepartureDateState.Arrival, dateTime: 0 }}
        onChange={onChange}
      />,
    );

    const date = output.getByLabelText('Dato');

    fireEvent.change(date, { target: { value: '2100-01-01' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('should call onTimeChange', async () => {
    const onChange = vi.fn();
    const output = render(
      <DepartureDateSelector
        initialState={{ type: DepartureDateState.Arrival, dateTime: 0 }}
        onChange={onChange}
      />,
    );

    const time = output.getByLabelText('Tid');

    fireEvent.change(time, { target: { value: '00:00' } });

    expect(onChange).toHaveBeenCalled();
  });
});
