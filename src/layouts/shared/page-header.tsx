import { MonoIcon } from '@atb/assets/mono-icon';
import { CommonText, PageText, useTranslation } from '@atb/translations';
import { and, andIf } from '@atb/utils/css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MutableRefObject, useRef } from 'react';
import { Hamburger, useTogglableBurgerMenu } from './menu-utils';
import style from './page-header.module.css';

export type PageHeaderProps = {
  withoutMenu?: boolean;
};
export default function PageHeader({ withoutMenu = false }: PageHeaderProps) {
  const showMenu = !withoutMenu;
  const { t } = useTranslation();

  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLDivElement | null>(null);

  const { isMenuVisible, setMenuVisible, tabIndex } = useTogglableBurgerMenu(
    modalRef,
    closeRef,
  );

  return (
    <div ref={modalRef}>
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
                  src="/logo/logo.svg"
                  alt=""
                  role="none"
                  size="normal"
                  overrideColor="black"
                />
                <span>{t(CommonText.Titles.siteTitle)}</span>
              </Link>
            </h1>
          </div>
          {showMenu ? (
            <>
              <Navigation />
              <div className={style.burgerButtonContainer} ref={closeRef}>
                <span hidden id="menu-label">
                  Hovedmeny
                </span>
                <Hamburger
                  onClick={() => setMenuVisible(!isMenuVisible)}
                  isOpen={isMenuVisible}
                />
              </div>
            </>
          ) : null}
        </div>
      </header>

      {showMenu ? (
        <Navigation inModal={true} tabIndex={tabIndex} isOpen={isMenuVisible} />
      ) : null}
    </div>
  );
}

type NavigationProps = {
  inModal?: boolean;
  isOpen?: boolean;
  tabIndex?: number;
  modalRef?: MutableRefObject<HTMLDivElement | null>;
};
function Navigation({
  inModal = false,
  isOpen,
  modalRef,
  tabIndex,
}: NavigationProps) {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <div
      className={and(
        style.pageHeader__nav,
        inModal && style['pageHeader__nav--modal'],
        !inModal && style['pageHeader__nav--notModal'],
        isOpen && style['pageHeader__nav--open'],
      )}
      ref={modalRef}
    >
      <nav
        aria-labelledby="menu-label"
        aria-hidden={isOpen === undefined ? undefined : !isOpen}
      >
        <ul>
          <li></li>
          <li>
            <HeaderLink
              {...getActiveProps('/departures', router.pathname)}
              title={t(PageText.Departures.title)}
              tabIndex={tabIndex}
              testID="navDeparturesButton"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
}

type HeaderLinkProps = {
  state?: 'active' | 'none';
  title: string;
  href: string;
  tabIndex?: number;
  testID?: string;
};
function HeaderLink({
  href,
  title,
  tabIndex,
  testID,
  state = 'none',
}: HeaderLinkProps) {
  const className = andIf({
    [style.pageHeader__link]: true,
    [style['pageHeader__link--active']]: state == 'active',
  });
  return (
    <Link
      href={href}
      shallow
      tabIndex={tabIndex}
      className={className}
      data-testid={testID}
    >
      {title}
    </Link>
  );
}

function getActiveProps(
  href: string,
  activeRoute: string,
): Pick<HeaderLinkProps, 'href' | 'state'> {
  // @TODO This must be more sophisticated.
  if (href === '/' && activeRoute == href) {
    return {
      href,
      state: 'active',
    };
  }
  const isActive = href !== '/' && activeRoute.startsWith(href);

  return {
    href,
    state: isActive ? 'active' : 'none',
  };
}
