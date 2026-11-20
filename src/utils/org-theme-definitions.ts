import { useDarkMode } from '@atb/modules/theme';
import { useThemeOrgData } from '@atb/modules/theme/dev-org-theme';
import { MonoIconOverrideMode } from '@atb/components/icon';

export function useOrgThemeDefinitions() {
  const [isDarkMode] = useDarkMode();
  const { fylkeskommune, orgId, featureConfig } = useThemeOrgData();
  const isForcingTheme = featureConfig.forceTheme !== undefined;

  const fylkeskommuneLogo =
    isDarkMode || orgId !== 'atb'
      ? fylkeskommune?.logoSrcDark
      : fylkeskommune?.logoSrc;

  const overrideMonoIconMode: MonoIconOverrideMode =
    orgId === 'atb' ? (isDarkMode ? 'dark' : 'light') : 'dark';

  return {
    orgId,
    fylkeskommune,
    fylkeskommuneLogo,
    overrideMonoIconMode,
    isForcingTheme,
  };
}
