import { createThemesFor, ThemeVariant } from '@atb-as/theme';
import { useDarkmodeCookie } from '@atb/modules/cookies';
import { currentOrg, getOrgData, WEBSHOP_ORGS } from '@atb/modules/org-data';
import { useEffect } from 'react';

export type {
  InteractiveColor,
  InteractiveState,
  StatusColorName,
  TransportColors,
  ContrastColor,
  TextColorType,
} from '@atb-as/theme';

export const theme = createThemesFor(getThemeVariant(currentOrg));

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
  const forceTheme = getOrgData().featureConfig.forceTheme;
  if (forceTheme) {
    return [forceTheme == 'dark', () => {}];
  }
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

      const theme = isDarkMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    },
    [isDarkMode],
  );
}
