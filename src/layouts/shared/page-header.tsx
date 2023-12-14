import { CommonText, PageText, useTranslation } from '@atb/translations';
import Link from 'next/link';
import style from './page-header.module.css';
import { MonoIcon } from '@atb/components/icon';

export default function PageHeader() {
  const { t } = useTranslation();

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
              <MonoIcon
                icon="logo/logo"
                alt=""
                role="none"
                size="normal"
                overrideMode="dark"
              />
              <span>{t(CommonText.Titles.siteTitle)}</span>
            </Link>
          </h1>
        </div>
      </div>
    </header>
  );
}
