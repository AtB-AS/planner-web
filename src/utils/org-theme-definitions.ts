import { useDarkMode } from '@atb/modules/theme';
import { getOrgData } from '@atb/modules/org-data';
import { MonoIconOverrideMode } from '@atb/components/icon';

export function useOrgThemeDefinitions() {
  const [isDarkMode] = useDarkMode();
  const { fylkeskommune, orgId } = getOrgData();

  const fylkeskommuneLogo =
    isDarkMode || orgId !== 'atb'
      ? fylkeskommune?.logoSrcDark
      : fylkeskommune?.logoSrc;

  const overrideMonoIconMode: MonoIconOverrideMode =
    orgId === 'atb' ? (isDarkMode ? 'dark' : 'light') : 'dark';

  return { fylkeskommuneLogo, overrideMonoIconMode };
}
