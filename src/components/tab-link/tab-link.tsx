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
  activePath: Route;
};

type TabLink = {
  title: TranslatedString;
  route: Route;
};

type Route = '/assistant' | '/departures';

const tabLinks: TabLink[] = [
  {
    title: ComponentText.TabLink.assistant,
    route: '/assistant',
  },
  {
    title: ComponentText.TabLink.departures,
    route: '/departures',
  },
];

const TabLink = ({ activePath }: TabLinkProps) => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      {tabLinks.map((tabLink, index) => {
        const isActive = tabLink.route === activePath;
        return (
          <Link key={index} className={style.href} href={tabLink.route}>
            <Typo.p textType={isActive ? 'body__m__strong' : 'body__m'}>
              {t(tabLink.title)}
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
