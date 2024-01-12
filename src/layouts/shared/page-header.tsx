import { CommonText, PageText, useTranslation } from '@atb/translations';
import Link from 'next/link';
import style from './page-header.module.css';
import { useDarkMode } from '@atb/modules/theme';
import Image from 'next/image';
import { getOrgData } from '@atb/modules/org-data';

export default function PageHeader() {
  const { t } = useTranslation();
  const [isDarkMode] = useDarkMode();
  const { fylkeskommune } = getOrgData();

  return (
    <header className={style.pageHeader}>
      <div className={style.pageHeader__content}>
        <div className={style.pageHeader__inner}>
          <h1 className={style.pageHeader__logo}>
            <Link
              href="/"
              className={style.pageHeader__logoLink}
              data-testid="homeButton"
            >
              {fylkeskommune && (
                <Image
                  fill
                  src={
                    isDarkMode
                      ? fylkeskommune.logoSrcDark
                      : fylkeskommune.logoSrc
                  }
                  alt={fylkeskommune.name}
                />
              )}
              <span>{t(CommonText.Titles.siteTitle)}</span>
            </Link>
          </h1>
        </div>
      </div>
    </header>
  );
}
