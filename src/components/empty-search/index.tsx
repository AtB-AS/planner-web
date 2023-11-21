import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';
import { Image } from '@atb/components/icon';

import style from './empty-search.module.css';
import { Typo } from '../typography';
import { ComponentText, useTranslation } from '@atb/translations';
import React from 'react';

export type EmptyLoadingSearchProps = PropsWithChildren<{
  isSearching: boolean;
  type: keyof typeof ComponentText.EmptySearch.searching;
}>;

export default function EmptyLoadingSearch({
  isSearching,
  type,
  children,
}: EmptyLoadingSearchProps) {
  const { t } = useTranslation();

  const hasEmptyChild = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      return 'empty' in child.props;
    }
    return false;
  });

  return (
    <>
      {!isSearching && hasEmptyChild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={style.isSearching}
        >
          <Image
            className={style.emptyImage}
            image="EmptyIllustration"
            role="none"
            alt=""
          />
          <Typo.p textType="body__primary">
            {t(ComponentText.EmptySearch.notSearched)}
          </Typo.p>
        </motion.div>
      )}
      {isSearching && hasEmptyChild && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={style.isSearching}
        >
          <Typo.p textType="body__primary">
            {t(ComponentText.EmptySearch.searching[type])}
          </Typo.p>
        </motion.div>
      )}
      {!isSearching && !hasEmptyChild && children}
    </>
  );
}
