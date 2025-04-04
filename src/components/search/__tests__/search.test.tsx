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
import SwapButton from '../swap-button';

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
          '/api/departures/autocomplete?q=test&onlyStopPlaces=false': result,
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
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', {
        name: /test/i,
      }),
    ).toBeInTheDocument();
  });

  it('should have focus', () => {
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

    const search = screen.getByRole('combobox', {
      name: /test/i,
    });

    search.focus();

    expect(search).toHaveFocus();
  });

  it('should render with swap button', () => {
    customRender(
      <Search
        label="Test"
        placeholder="Test"
        onChange={() => {}}
        button={<SwapButton onSwap={() => {}} />}
      />,
    );

    const swapButton = screen.getByRole('button', {
      name: 'Bytt avreisested og ankomststed',
    });

    expect(swapButton).toBeDefined();
  });

  it('should focus input when clicking label', async () => {
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

    const label = screen.getByText('Test');

    await userEvent.click(label);

    expect(
      screen.getByRole('textbox', {
        name: /test/i,
      }),
    ).toHaveFocus();
  });

  it('should type in input', async () => {
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    expect(input).toHaveValue('test');
  });

  it('should empty input when clicking outside and not selecting', async () => {
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

    const input = screen.getByRole('textbox', {
      name: /test/i,
    });

    await userEvent.type(input, 'test');

    await userEvent.click(document.body);

    expect(input).toHaveValue('');
  });

  it('should show results after typing', async () => {
    customRender(
      <Search label="Test" placeholder="Test" onChange={() => {}} />,
    );

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
    customRender(<Search label="Test" placeholder="Test" onChange={fn} />);

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
    const fn = vi.fn();
    customRender(<Search label="Test" placeholder="Test" onChange={fn} />);

    // Set focus to open the dropdown
    const input = screen.getByRole('textbox', {
      name: /test/i,
    });
    await userEvent.click(input);

    const geolocationOption = screen.getByRole('option', {
      name: 'Min posisjon',
    });
    await userEvent.click(geolocationOption);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should render Search component with expected placeholder text', () => {
    const testPlaceholder = 'Søk fra adresse, kai eller holdeplass';
    customRender(
      <Search label="Test" placeholder={testPlaceholder} onChange={() => {}} />,
    );

    const inputElement = screen.getByPlaceholderText(testPlaceholder);
    expect(inputElement).toBeInTheDocument();
  });
});
