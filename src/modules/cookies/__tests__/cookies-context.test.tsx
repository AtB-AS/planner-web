import { render, cleanup } from '@testing-library/react';
import { afterEach, expect, it, describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  AppCookiesProvider,
  AppCookiesProviderProps,
  useCookieSettings,
  useDarkmodeCookie,
  useLanguageCookie,
} from '../cookies-context';

afterEach(function () {
  cleanup();
});

type RenderProps = { providerProps: AppCookiesProviderProps };
const customRender = (
  ui: React.ReactNode,
  { providerProps, ...renderOptions }: RenderProps,
) => {
  return render(
    <AppCookiesProvider {...providerProps}>{ui}</AppCookiesProvider>,
    renderOptions,
  );
};

describe('cookie contexts', function () {
  it('Should provide default state as passed in', () => {
    const providerProps: AppCookiesProviderProps = {
      initialCookies: {
        darkmode: true,
        language: 'no',
      },
    };
    const TestConsumer = function () {
      const state = useCookieSettings();

      return (
        <div>
          <p>Darkmode: {String(state?.darkmode[0]) ?? ''}</p>
          <p>Language: {state?.language[0] ?? ''}</p>
        </div>
      );
    };

    const output = customRender(<TestConsumer />, { providerProps });
    expect(output.getByText(/^Darkmode:/).textContent).toBe('Darkmode: true');
    expect(output.getByText(/^Language:/).textContent).toBe('Language: no');
  });

  describe('language', function () {
    it('Should language cookie', () => {
      const providerProps: AppCookiesProviderProps = {
        initialCookies: {
          darkmode: true,
          language: 'no',
        },
      };
      const TestConsumer = function () {
        const [lang] = useLanguageCookie();

        return (
          <div>
            <p>Language: {lang ?? ''}</p>
          </div>
        );
      };

      const output = customRender(<TestConsumer />, { providerProps });
      expect(output.getByText(/^Language:/).textContent).toBe('Language: no');
    });

    it('Should language cookie', async () => {
      const providerProps: AppCookiesProviderProps = {
        initialCookies: {
          darkmode: true,
          language: 'no',
        },
      };
      const TestConsumer = function () {
        const [lang, setLanguage] = useLanguageCookie();

        return (
          <div>
            <p>Language: {lang ?? ''}</p>
            <button onClick={() => setLanguage('en')}>Change</button>
          </div>
        );
      };

      const output = customRender(<TestConsumer />, { providerProps });
      expect(output.getByText(/^Language:/).textContent).toBe('Language: no');

      const user = userEvent.setup();
      await user.click(output.getByRole('button'));
      expect(output.getByText(/^Language:/).textContent).toBe('Language: en');
    });
  });

  describe('darkmode', function () {
    it('Should darkmode cookie', () => {
      const providerProps: AppCookiesProviderProps = {
        initialCookies: {
          darkmode: true,
          language: 'no',
        },
      };
      const TestConsumer = function () {
        const [darkmode] = useDarkmodeCookie();

        return (
          <div>
            <p>Darkmode: {String(darkmode) ?? ''}</p>
          </div>
        );
      };

      const output = customRender(<TestConsumer />, { providerProps });
      expect(output.getByText(/^Darkmode:/).textContent).toBe('Darkmode: true');
    });

    it('Should language cookie', async () => {
      const providerProps: AppCookiesProviderProps = {
        initialCookies: {
          darkmode: true,
          language: 'no',
        },
      };
      const TestConsumer = function () {
        const [darkmode, setDarkmode] = useDarkmodeCookie();

        return (
          <div>
            <p>Darkmode: {String(darkmode) ?? ''}</p>
            <button onClick={() => setDarkmode(false)}>Change</button>
          </div>
        );
      };

      const output = customRender(<TestConsumer />, { providerProps });
      expect(output.getByText(/^Darkmode:/).textContent).toBe('Darkmode: true');

      const user = userEvent.setup();
      await user.click(output.getByRole('button'));
      expect(output.getByText(/^Darkmode:/).textContent).toBe(
        'Darkmode: false',
      );
    });
  });
});
