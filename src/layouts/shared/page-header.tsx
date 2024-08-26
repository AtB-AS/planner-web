import { CommonText, useTranslation } from '@atb/translations';
import Link from 'next/link';
import style from './page-header.module.css';
import { useDarkMode } from '@atb/modules/theme';
import Image from 'next/image';
import { getOrgData } from '@atb/modules/org-data';
import { MonoIcon } from '@atb/components/icon';
import { shouldShowContactPage } from '@atb/page-modules/contact/utils';

export default function PageHeader() {
  const { t } = useTranslation();
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
          {hasContactFormUrl && (
            <Link
              className={style.pageHeader__link}
              href={'/contact'}
              title={t(CommonText.Layout.contactLink)}
            >
              <h4>{t(CommonText.Layout.contactLink)}</h4>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
