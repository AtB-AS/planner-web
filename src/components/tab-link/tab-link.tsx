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

type AssistantDepartureTogglProp = {
  href?: string;
};

type LinkProps = {
  name: string;
  title: TranslatedString;
  link: string;
};

const links: LinkProps[] = [
  {
    name: 'assistant',
    title: ComponentText.TabLink.assistant,
    link: '/assistant',
  },
  {
    name: 'departures',
    title: ComponentText.TabLink.departures,
    link: '/departures/[[...id]]',
  },
];

const setInitialActiveLink = (href: string | undefined) => {
  const link = links.find((link) => link.link === href);
  return link?.name;
};

const handleClick = (linkName: string, setActiveLink: Function) => {
  setActiveLink(linkName);
};

const AssistantDepartureToggle = ({ href }: AssistantDepartureTogglProp) => {
  const { t } = useTranslation();
  const [activeLink, setActiveLink] = useState(() =>
    setInitialActiveLink(href),
  );

  return (
    <div className={style.container}>
      {links.map((link, index) => (
        <Link
          key={index}
          className={style.link}
          href={link.link}
          onClick={() => handleClick(link.name, setActiveLink)}
        >
          <Typo.p
            textType={
              activeLink === link.name ? 'body__primary--bold' : 'body__primary'
            }
          >
            {t(link.title)}
          </Typo.p>
          <AnimatePresence initial={false}>
            {activeLink === link.name && (
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
export default AssistantDepartureToggle;
