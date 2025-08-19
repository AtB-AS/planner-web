import { CommonText, useTranslation } from '@atb/translations';
import Link from 'next/link';
import style from './page-header.module.css';
import { useTheme } from '@atb/modules/theme';
import Image from 'next/image';
import { getOrgData } from '@atb/modules/org-data';
import { MonoIcon } from '@atb/components/icon';
import { ButtonLink } from '@atb/components/button';
import { useOrgThemeDefinitions } from '@atb/utils/org-theme-definitions.ts';

export default function PageHeader() {
  const { t } = useTranslation();
  const { color } = useTheme();
  const { fylkeskommune, urls } = getOrgData();

  const { fylkeskommuneLogo, overrideMonoIconMode } = useOrgThemeDefinitions();

  return (
    <header className={style.pageHeader}>
      <div className={style.pageHeader__content}>
        <div className={style.pageHeader__inner}>
          <h1 className={style.pageHeader__logo}>
            <Link
              href={'/'}
              className={style.pageHeader__logoLink}
              data-testid="homeButton"
            >
              {fylkeskommune?.replaceTitleWithLogoInHeader &&
              fylkeskommuneLogo ? (
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  src={fylkeskommuneLogo}
                  alt={fylkeskommune.name}
                />
              ) : (
                <>
                  <MonoIcon
                    icon="logo/logo"
                    alt=""
                    role="none"
                    size="normal"
                    overrideMode={overrideMonoIconMode}
                  />
                  <span>{t(CommonText.Titles.siteTitle)}</span>
                </>
              )}
            </Link>
          </h1>
        </div>
        <ButtonLink
          href={urls.homePageUrl.href}
          title={t(CommonText.Layout.homeLink(urls.homePageUrl.name))}
          icon={{
            right: (
              <MonoIcon
                icon="navigation/ExternalLink"
                overrideMode={overrideMonoIconMode}
              />
            ),
          }}
          mode="secondary"
          backgroundColor={color.background.accent['4']}
          radiusSize="circular"
          size="pill"
          aProps={{
            target: '_blank',
          }}
        />
      </div>
    </header>
  );
}
