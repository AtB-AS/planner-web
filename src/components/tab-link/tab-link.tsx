import Link from 'next/link';
import style from './tab-link.module.css';
import {
  ComponentText,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import { useState } from 'react';
import { Typo } from '../typography';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

type LinkProps = {
  title: TranslatedString;
  href: string;
};

const links: LinkProps[] = [
  {
    title: ComponentText.TabLink.assistant,
    href: '/assistant',
  },
  {
    title: ComponentText.TabLink.departures,
    href: '/departures',
  },
];

const setInitialActivePath = (href: string | undefined) => {
  const link = links.find((link) => link.href === href);
  return link?.href;
};

const rewritePathIfDynamic = (path: string) => {
  return path.replace('/[[...id]]', '');
};

const TabLink = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activePath, setActivePath] = useState(() =>
    setInitialActivePath(rewritePathIfDynamic(router.pathname)),
  );

  return (
    <div className={style.container}>
      {links.map((link, index) => (
        <Link
          key={index}
          className={style.href}
          href={link.href}
          onClick={() => setActivePath(rewritePathIfDynamic(router.pathname))}
        >
          <Typo.p
            textType={
              activePath === link.href ? 'body__primary--bold' : 'body__primary'
            }
          >
            {t(link.title)}
          </Typo.p>
          <AnimatePresence initial={false}>
            {activePath === link.href && (
              <motion.div
                className={style.underline}
                layoutId="underline"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
        </Link>
      ))}
    </div>
  );
};
export default TabLink;
