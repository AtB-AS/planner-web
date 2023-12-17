import { motion } from 'framer-motion';
import React, { PropsWithChildren } from 'react';
import EmptyMessage from '@atb/components/empty-message';
import { Typo } from '@atb/components/typography';
import { ComponentText, useTranslation } from '@atb/translations';

import style from './loading-empty-results.module.css';

export type LoadingEmptyResultsProps = PropsWithChildren<{
  isSearching: boolean;
  isGeolocationError?: boolean;
  type: keyof typeof ComponentText.EmptySearch.searching;
}>;

export default function LoadingEmptyResults({
  isSearching,
  isGeolocationError = false,
  type,
  children,
}: LoadingEmptyResultsProps) {
  const { t } = useTranslation();

  const hasEmptyChild = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      return 'empty' in child.props;
    }
    return false;
  });

  return (
    <>
      {!isSearching && !isGeolocationError && hasEmptyChild && (
        <EmptyMessage
          title={t(ComponentText.EmptySearch.notSearched)}
          details={t(ComponentText.EmptySearch.emptyDetails[type])}
        />
      )}
      {isSearching && (
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
      {!isSearching && isGeolocationError && hasEmptyChild && (
        <EmptyMessage
          title={t(ComponentText.EmptySearch.nearbyNoGeolocation.title)}
          details={t(ComponentText.EmptySearch.nearbyNoGeolocation.details)}
        />
      )}
      {!isSearching && !hasEmptyChild && children}
    </>
  );
}
