import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import LoadingEmptySearch from '@atb/components/loading-empty-results';
import { MessageBox } from '@atb/components/message-box';
import Search from '@atb/components/search';
import GeolocationButton from '@atb/components/search/geolocation-button';
import { Typo } from '@atb/components/typography';
import { SearchTime, SearchTimeSelector } from '@atb/modules/search-time';
import {
  TransportModeFilter,
  getInitialTransportModeFilter,
} from '@atb/modules/transport-mode';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import style from './departures.module.css';
import type { FromDepartureQuery } from './types';
import { createFromQuery } from './utils';
import { TabLink } from '@atb/components/tab-link';

export type DeparturesLayoutProps = PropsWithChildren<{
  fromQuery: FromDepartureQuery;
}>;

function DeparturesLayout({ children, fromQuery }: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [searchTime, setSearchTime] = useState<SearchTime>(
    fromQuery.searchTime,
  );
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(fromQuery.transportModeFilter),
  );
  const [isSearching, setIsSearching] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const doSearch = async (override: Partial<FromDepartureQuery>) => {
    setIsSearching(true);
    const newRoute = createFromQuery(
      { ...fromQuery, ...override, searchTime },
      transportModeFilter,
    );
    await router.push(newRoute);
    setIsSearching(false);
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    return doSearch({});
  };

  const onSelectFeature = (feature: GeocoderFeature) =>
    doSearch({ from: feature });

  return (
    <div className={style.departuresPage}>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={style.main}
        >
          <TabLink activePath="/departures" />

          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.input.label)}
            </Typo.p>
            <Search
              label={t(PageText.Departures.search.input.from)}
              placeholder={t(PageText.Departures.search.input.placeholder)}
              selectedItem={fromQuery.from ?? undefined}
              onChange={onSelectFeature}
              button={
                <GeolocationButton
                  className={style.geolocationButton}
                  onGeolocate={onSelectFeature}
                  onError={setGeolocationError}
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

          {geolocationError !== null && (
            <div className={style.spanColumns}>
              <MessageBox type="warning" message={geolocationError} />
            </div>
          )}
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
            title={
              showAlternatives
                ? t(PageText.Departures.search.buttons.alternatives.less)
                : t(PageText.Departures.search.buttons.alternatives.more)
            }
            className={style.button}
            mode="interactive_2"
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />

          <Button
            title={t(PageText.Departures.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!fromQuery.from}
            buttonProps={{ type: 'submit' }}
            state={isSearching ? 'loading' : undefined}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <LoadingEmptySearch
          isSearching={isSearching}
          isGeolocationError={geolocationError !== null}
          type={fromQuery.from?.layer === 'venue' ? 'stopPlace' : 'nearby'}
        >
          {children}
        </LoadingEmptySearch>
      </section>
    </div>
  );
}

export default DeparturesLayout;
