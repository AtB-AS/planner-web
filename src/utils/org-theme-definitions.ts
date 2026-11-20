import { useDarkMode } from '@atb/modules/theme';
import { useThemeOrgData } from '@atb/modules/theme/dev-org-theme';

export function useOrgThemeDefinitions() {
  const [isDarkMode] = useDarkMode();
  const { fylkeskommune, orgId, featureConfig } = useThemeOrgData();
  const isForcingTheme = featureConfig.forceTheme !== undefined;

  const fylkeskommuneLogo =
    isDarkMode || orgId !== 'atb'
      ? fylkeskommune?.logoSrcDark
      : fylkeskommune?.logoSrc;

  return {
    orgId,
    fylkeskommune,
    fylkeskommuneLogo,
    isForcingTheme,
  };
}
