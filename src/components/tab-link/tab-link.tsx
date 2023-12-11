import Link from 'next/link';
import style from './tab-link.module.css';
import {
  ComponentText,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import { Typo } from '../typography';
import { AnimatePresence, motion } from 'framer-motion';

type TabLinkProps = {
  activePath: string;
};

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

const rewritePathIfDynamic = (path: string) => {
  return path.replace('/[[...id]]', '');
};

const TabLink = ({ activePath }: TabLinkProps) => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      {links.map((link, index) => {
        const isActive = rewritePathIfDynamic(activePath) === link.href;
        return (
          <Link
            key={index}
            className={style.href}
            href={link.href}
            onClick={() => rewritePathIfDynamic(activePath)}
          >
            <Typo.p
              textType={isActive ? 'body__primary--bold' : 'body__primary'}
            >
              {t(link.title)}
            </Typo.p>
            <AnimatePresence initial={false}>
              {isActive && (
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
        );
      })}
    </div>
  );
};
export default TabLink;
