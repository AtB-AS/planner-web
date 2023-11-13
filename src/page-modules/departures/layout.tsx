import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import Search from '@atb/components/search';
import { Button } from '@atb/components/button';
import style from './departures.module.css';
import { useRouter } from 'next/router';
import TransportModeFilter from '@atb/components/transport-mode-filter';
import { Typo } from '@atb/components/typography';
import {
  filterToQueryString,
  getInitialTransportModeFilter,
} from '@atb/components/transport-mode-filter/utils';
import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { MonoIcon } from '@atb/components/icon';
import { FocusScope } from '@react-aria/focus';
import GeolocationButton from '@atb/components/search/geolocation-button';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { SearchTime, SearchTimeSelector } from '@atb/modules/search-time';

export type DeparturesLayoutProps = PropsWithChildren<{
  initialTransportModesFilter?: TransportModeFilterOption[] | null;
}>;

function DeparturesLayout({
  children,
  initialTransportModesFilter,
}: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GeocoderFeature>();
  const [searchTime, setSearchTime] = useState<SearchTime>({ mode: 'now' });
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(initialTransportModesFilter),
  );
  const [isSearching, setIsSearching] = useState(false);

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    let query = {};

    const filter = filterToQueryString(transportModeFilter);

    if (filter) {
      query = {
        filter,
      };
    }

    if (selectedFeature?.layer == 'venue') {
      setIsSearching(true);
      // TODO: Using URL object encodes all query params
      await router.push({
        pathname: `/departures/[[...id]]`,
        query: { ...query, id: selectedFeature.id },
      });
    } else if (selectedFeature?.layer == 'address') {
      setIsSearching(true);
      const [lon, lat] = selectedFeature.geometry.coordinates;
      await router.push({
        href: '/departures',
        query: {
          ...query,
          lon,
          lat,
        },
      });
    }
    setIsSearching(false);
  };

  const hasEmptyChild = React.Children.toArray(children).some((child) => {
    if (React.isValidElement(child)) {
      return 'empty' in child.props;
    }
    return false;
  });

  return (
    <div className={style.departuresPage}>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={style.main}
        >
          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.input.label)}
            </Typo.p>

            <Search
              label={t(PageText.Departures.search.input.from)}
              selectedItem={selectedFeature}
              onChange={setSelectedFeature}
              button={
                <GeolocationButton
                  className={style.geolocationButton}
                  onGeolocate={setSelectedFeature}
                />
              }
            />
          </div>

          <div className={style.date}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.date.label)}
            </Typo.p>

            <SearchTimeSelector
              initialState={searchTime}
              onChange={setSearchTime}
              options={['now', 'departBy']}
            />
          </div>
        </motion.div>

        <AnimatePresence initial={false}>
          {showAlternatives && (
            <FocusScope contain={false} autoFocus={showAlternatives}>
              <motion.div
                className={style.alternativesWrapper}
                key="content"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: 'auto' },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className={style.alternatives}>
                  <div>
                    <Typo.p
                      textType="body__primary--bold"
                      className={style.heading}
                    >
                      {t(PageText.Departures.search.filter.label)}
                    </Typo.p>

                    <TransportModeFilter
                      filterState={transportModeFilter}
                      onFilterChange={setTransportModeFilter}
                    />
                  </div>
                </div>
              </motion.div>
            </FocusScope>
          )}
        </AnimatePresence>

        <div className={style.buttons}>
          <Button
            title={t(PageText.Departures.search.buttons.alternatives.title)}
            className={style.button}
            mode={showAlternatives ? 'interactive_3' : 'interactive_2'}
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />

          <Button
            title={t(PageText.Departures.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!selectedFeature}
            buttonProps={{ type: 'submit' }}
            state={isSearching ? 'loading' : undefined}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        {isSearching && hasEmptyChild ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={style.isSearching}
          >
            <Typo.p textType="body__primary">
              {selectedFeature?.layer === 'venue'
                ? t(PageText.Departures.search.searching.stopPlace)
                : t(PageText.Departures.search.searching.nearby)}
            </Typo.p>
          </motion.div>
        ) : (
          children
        )}
      </section>
    </div>
  );
}

export default DeparturesLayout;
