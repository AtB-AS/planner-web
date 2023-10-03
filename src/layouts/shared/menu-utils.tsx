import {and} from '@atb/utils/css';
import {MutableRefObject, useCallback, useEffect, useState} from 'react';
import style from './page-header.module.css';

export function Hamburger({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={and(
        style.hamburger,
        isOpen ? style.hamburger__open : undefined,
      )}
      type="button"
      aria-labelledby="menu-label"
      aria-expanded={isOpen}
      data-testid="menuButton"
      onClick={onClick}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
}

export function useTogglableBurgerMenu<
  T extends HTMLElement,
  R extends HTMLElement,
>(
  modalRef: MutableRefObject<T | null>,
  closeButton: MutableRefObject<R | null>,
  breakpointMinWidth = '800px',
) {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const isNotHamburgerMode =
    useMediaQuery(`(min-width: ${breakpointMinWidth})`) ?? true;

  useEffect(() => {
    setTabIndex(isMenuVisible && !isNotHamburgerMode ? 0 : -1);

    // Avoid scrolling when menu is visible.
    if (isMenuVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }, [isMenuVisible, isNotHamburgerMode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isMenuVisible || closeButton.current?.contains(e.target as Node)) {
        return;
      }
      if (!e.target || !modalRef.current?.contains(e.target as Node)) {
        return setMenuVisible(false);
      }
      if ((e.target as Node).nodeName === 'A') {
        return setMenuVisible(false);
      }
    };
    document.body.addEventListener('click', handleClickOutside);
    return () => document.body.removeEventListener('click', handleClickOutside);
  }, [isMenuVisible, modalRef, closeButton]);

  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      const focusableModalElements =
        modalRef.current?.querySelectorAll<HTMLElement>(
          '[role="button"],a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
        ) ?? [];
      const allFocusables =
        document.querySelectorAll<HTMLElement>(
          '[role="button"],a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
        ) ?? [];

      const first = focusableModalElements[0];
      const last = focusableModalElements[focusableModalElements.length - 1];
      const next =
        Array.from(allFocusables).find(
          (_, i) => allFocusables[i - 1] === document.activeElement,
        ) ?? null;
      const previous =
        Array.from(allFocusables).find(
          (_, i) => allFocusables[i + 1] === document.activeElement,
        ) ?? null;

      // On normal tabbing. If next element is outside modal, jump to first element
      if (!e.shiftKey && !modalRef.current?.contains(next)) {
        first?.focus();
        return e.preventDefault();
      }

      // On "reversed" tabbing. If previous element is outside modal, jump to last element
      if (e.shiftKey && !modalRef.current?.contains(previous)) {
        last?.focus();
        return e.preventDefault();
      }

      // Not start or end, follow normal tab flow.
    },
    [modalRef],
  );
  useEffect(() => {
    function keyListener(e: KeyboardEvent) {
      if (!isMenuVisible || isNotHamburgerMode) {
        return;
      }
      if (e.key === 'Escape') {
        return setMenuVisible(false);
      }
      if (e.key === 'Tab') {
        return handleTabKey(e);
      }
    }
    document.addEventListener('keydown', keyListener);
    return () => document.removeEventListener('keydown', keyListener);
  }, [isMenuVisible, isNotHamburgerMode, handleTabKey]);

  return {
    isMenuVisible,
    setMenuVisible,
    tabIndex,
  };
}

function hasWindow() {
  return typeof window !== 'undefined';
}

const useMediaQuery = (mediaQuery: string) => {
  const [isMatched, setMatched] = useState(() => {
    if (!hasWindow()) return false;
    return Boolean(window.matchMedia(mediaQuery).matches);
  });

  useEffect(() => {
    if (!hasWindow()) return;
    const mediaQueryList = window.matchMedia(mediaQuery);
    const documentChangeHandler = () =>
      setMatched(Boolean(mediaQueryList.matches));
    listenTo(mediaQueryList, documentChangeHandler);

    documentChangeHandler();
    return () => removeListener(mediaQueryList, documentChangeHandler);
  }, [mediaQuery]);

  return isMatched;
};

function listenTo(
  matcher: MediaQueryList,
  cb: (ev: MediaQueryListEvent) => void,
) {
  if ('addEventListener' in (matcher as any)) {
    return matcher.addEventListener('change', cb);
  }
  return matcher.addListener(cb);
}

function removeListener(
  matcher: MediaQueryList,
  cb: (ev: MediaQueryListEvent) => void,
) {
  if ('removeEventListener' in (matcher as any)) {
    return matcher.removeEventListener('change', cb);
  }
  return matcher.removeListener(cb);
}
