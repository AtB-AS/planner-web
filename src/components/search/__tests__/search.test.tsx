import {
  afterEach,
  describe,
  it,
  expect,
  vi,
  afterAll,
  beforeAll,
} from 'vitest';
import Search from '@atb/components/search';
import {
  cleanup,
  render,
  RenderOptions,
  screen,
  waitFor,
} from '@testing-library/react';

import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import React from 'react';

const result = [
  {
    id: 'Result:1',
    layer: 'venue',
    name: '1',
    locality: '1',
    category: ['onstreetBus'],
  },
];

const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

const initialGeolocation = global.navigator.geolocation;

beforeAll(() => {
  Object.defineProperty(global.navigator, 'geolocation', {
    writable: true,
    value: mockGeolocation,
  });
});

afterEach(() => cleanup());

afterAll(() => {
  Object.defineProperty(global.navigator, 'geolocation', {
    writable: true,
    value: initialGeolocation,
  });
});

const customRender = (ui: React.ReactNode, renderOptions?: RenderOptions) => {
  render(
    <SWRConfig
      value={{
        fallback: {
          '/api/departures/autocomplete?q=test': result,
        },
      }}
    >
      {ui}
    </SWRConfig>,
    renderOptions,
  );
};

describe('search box', () => {
  it('should render', () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', {
        name: /test/i,
      }),
    ).toBeInTheDocument();
  });

  it('should have focus', () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const search = screen.getByRole('combobox', {
      name: /test/i,
    });

    search.focus();

    expect(search).toHaveFocus();
  });

  it('should focus input when clicking label', async () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const label = screen.getByText('Test');

    await userEvent.click(label);

    expect(
      screen.getByRole('textbox', {
        name: /test/i,
      }),
    ).toHaveFocus();
  });

  it('should type in input', async () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    expect(input).toHaveValue('test');
  });

  it('should empty input when clicking outside and not selecting', async () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    await userEvent.click(document.body);

    expect(input).toHaveValue('');
  });

  it('should show results after typing', async () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    expect(input).toHaveFocus();
    expect(
      screen
        .getByRole('combobox', { name: /test/i })
        .getAttribute('aria-expanded'),
    ).toBe('true');

    const list = screen.getByRole('listbox', {
      name: /test/i,
    });

    await waitFor(() => {
      expect(list.children.length).toBeGreaterThan(0);
    });
  });

  it('should select item', async () => {
    const fn = vi.fn();
    customRender(<Search label="Test" onChange={fn} />);

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    await waitFor(async () => {
      const list = screen.getByRole('listbox', {
        name: /test/i,
      });

      expect(list.children.length).toBeGreaterThan(0);

      await userEvent.keyboard('{ArrowDown}{Enter}');

      expect(input).toHaveValue('1, 1');
      expect(fn).toHaveBeenCalled();
    });
  });

  it('should call getCurrentPosition when geolocating', async () => {
    customRender(<Search label="Test" onChange={() => {}} />);

    const geolocationButton = screen.getByRole('button', {
      name: 'Finn min posisjon',
    });

    await userEvent.click(geolocationButton);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });
});
