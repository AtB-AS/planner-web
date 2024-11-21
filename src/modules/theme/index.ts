import { ContrastColorFs, createThemesFor, ThemeFs, ThemeVariant, InteractiveColor as _InteractiveColor, TransportColor as _TransportColor, StatusColor as _StatusColor } from '@atb-as/theme';
import { useDarkmodeCookie } from '@atb/modules/cookies';
import { currentOrg, WEBSHOP_ORGS } from '@atb/modules/org-data';
import { useEffect } from 'react';

export type Theme = ThemeFs
export type ContrastColor = ContrastColorFs

export type TextColorName = keyof Theme['color']['foreground']

export type InteractiveColor = _InteractiveColor<ContrastColor>
export type InteractiveColorName = keyof Theme['color']['interactive']
export type InteractiveColors = Theme['color']['interactive']
export type InteractiveState = keyof InteractiveColor

export type TransportColor = _TransportColor<ContrastColor>
export type TransportColorName = keyof Theme['color']['transport']
export type TransportColors = Theme['color']['transport']
export type TransportColorState = keyof Theme['color']['transport']['city']

export type BackgroundColors = Theme['color']['background']
export type BackgroundColorName = keyof Theme['color']['background']
export type BackgroundColorState<T extends BackgroundColorName> = keyof Theme['color']['background'][T]

export type StatusColor = _StatusColor<ContrastColor>
export type StatusColorName = keyof Theme['color']['status']
export type StatusColors = Theme['color']['status']

export const theme = createThemesFor(getThemeVariant(currentOrg), {
  useFigmaStructure: true
});

function getThemeVariant(orgId: WEBSHOP_ORGS): ThemeVariant {
  switch (orgId) {
    case 'atb':
      return ThemeVariant.AtB;
    case 'nfk':
      return ThemeVariant.Nfk;
    case 'fram':
      return ThemeVariant.FRAM;
    case 'troms':
      return ThemeVariant.Troms;
    case 'vkt':
      return ThemeVariant.VKT;
    case 'farte':
      return ThemeVariant.Farte;
  }
}

export function useTheme() {
  const [isDarkMode, toggleDarkmode] = useDarkMode();
  return {
    ...theme[isDarkMode ? 'dark' : 'light'],
    isDarkMode,
    toggleDarkmode,
  };
}

export function useDarkMode(): [boolean, (value: boolean) => void] {
  const [enabledState, setEnabledState] = useDarkmodeCookie();
  // If enabledState is defined use it, otherwise fallback to prefersDarkMode.
  // This allows user to override OS level setting on our website.
  const enabled = enabledState ?? false;
  // Return enabled state and setter
  return [enabled, setEnabledState];
}

export function useHtmlDarkMode() {
  const [isDarkMode] = useDarkMode();

  useEffect(
    function () {
      if (typeof window === 'undefined') return;

      const theme = isDarkMode? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', theme);
    },
    [isDarkMode],
  );
}