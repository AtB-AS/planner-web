import { Button } from '@atb/components/button';
import LoadingEmptySearch from '@atb/components/loading-empty-results';
import { MonoIcon } from '@atb/components/icon';
import Search from '@atb/components/search';
import GeolocationButton from '@atb/components/search/geolocation-button';
import { Typo } from '@atb/components/typography';
import {
  SearchTime,
  SearchTimeSelector,
  searchTimeToQueryString,
} from '@atb/modules/search-time';
import {
  TransportModeFilter,
  TransportModeFilterOption,
  filterToQueryString,
  getInitialTransportModeFilter,
} from '@atb/modules/transport-mode';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'node:querystring';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import style from './departures.module.css';
import { MessageBox } from '@atb/components/message-box';

export type DeparturesLayoutProps = PropsWithChildren<{
  initialTransportModesFilter?: TransportModeFilterOption[] | null;
  initialSearchTime?: SearchTime;
  initialFeature?: GeocoderFeature;
}>;

function DeparturesLayout({
  children,
  initialTransportModesFilter,
  initialSearchTime,
  initialFeature,
}: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<
    GeocoderFeature | undefined
  >(initialFeature);
  const [searchTime, setSearchTime] = useState<SearchTime>(
    initialSearchTime ?? { mode: 'now' },
  );
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(initialTransportModesFilter),
  );
  const [isSearching, setIsSearching] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const doSearch = async () => {
    let query: ParsedUrlQueryInput = {
      ...searchTimeToQueryString(searchTime),
    };

    const filter = filterToQueryString(transportModeFilter);

    if (filter) {
      query = {
        ...query,
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

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    return doSearch();
  };

  const onSelectFeature = (feature: GeocoderFeature) => {
    setSelectedFeature(feature);
    doSearch();
  };

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
              initialFeature={initialFeature}
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
        <LoadingEmptySearch
          isSearching={isSearching}
          isGeolocationError={geolocationError !== null}
          type={selectedFeature?.layer === 'venue' ? 'stopPlace' : 'nearby'}
        >
          {children}
        </LoadingEmptySearch>
      </section>
    </div>
  );
}

export default DeparturesLayout;
