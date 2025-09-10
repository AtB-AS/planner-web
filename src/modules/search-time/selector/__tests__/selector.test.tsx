import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SearchTimeSelector from '..';

afterEach(function () {
  cleanup();
});

describe('search time selector', function () {
  it('should default to "Now"', async () => {
    const output = render(<SearchTimeSelector onChange={() => {}} />);

    expect(
      output.getByRole('radio', {
        name: 'Dra nå',
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

    const radio = output.getByRole('radio', { name: 'Dra nå' });
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
        name: 'Dra nå',
      }),
    ).toBeInTheDocument();

    expect(
      output.queryByRole('radio', {
        name: 'Avreise',
      }),
    ).toBeInTheDocument();
  });
});
