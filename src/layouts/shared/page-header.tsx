import { CommonText, useTranslation } from '@atb/translations';
import Link from 'next/link';
import style from './page-header.module.css';
import { useDarkMode } from '@atb/modules/theme';
import Image from 'next/image';
import { getOrgData } from '@atb/modules/org-data';
import { MonoIcon } from '@atb/components/icon';
import { andIf } from '@atb/utils/css';
import { useRouter } from 'next/router';
import { shouldShowContactPage } from '@atb/page-modules/contact';
import { ButtonLink } from '@atb/components/button';

export default function PageHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDarkMode] = useDarkMode();
  const { fylkeskommune, urls } = getOrgData();
  const hasContactFormUrl = shouldShowContactPage();

  return (
    <header className={style.pageHeader}>
      <div className={style.pageHeader__content}>
        <div className={style.pageHeader__inner}>
          <h1 className={style.pageHeader__logo}>
            <Link
              href={urls.homePageUrl.href}
              className={style.pageHeader__logoLink}
              title={t(CommonText.Layout.homeLink(urls.homePageUrl.name))}
              data-testid="homeButton"
            >
              {fylkeskommune?.replaceTitleWithLogoInHeader ? (
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                  src={
                    isDarkMode
                      ? fylkeskommune.logoSrcDark
                      : fylkeskommune.logoSrc
                  }
                  alt={fylkeskommune.name}
                />
              ) : (
                <>
                  <MonoIcon
                    icon="logo/logo"
                    alt=""
                    role="none"
                    size="normal"
                    overrideMode="dark"
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
          icon={{ right: <MonoIcon icon="navigation/ExternalLink" /> }}
          size="pill"
        />
        {/*
        {hasContactFormUrl && (
          <nav>
            <Link
              className={andIf({
                [style.pageHeader__link]: true,
                [style['pageHeader__link--active']]:
                  router.pathname.startsWith('/contact'),
              })}
              href={'/contact'}
              title={t(CommonText.Layout.contactLink)}
            >
              {t(CommonText.Layout.contactLink)}
            </Link>
          </nav>
        )}
      */}
      </div>
    </header>
  );
}
