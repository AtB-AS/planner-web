import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import EmptySearch from '@atb/components/loading-empty-results';
import { MessageBox } from '@atb/components/message-box';
import Search, { GeolocationButton, SwapButton } from '@atb/components/search';
import { Typo } from '@atb/components/typography';
import type { SearchTime } from '@atb/modules/search-time';
import SearchTimeSelector from '@atb/modules/search-time/selector';
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
import style from './assistant.module.css';
import { FromToTripQuery } from './types';
import { createTripQuery } from './utils';
import { TabLink } from '@atb/components/tab-link';

export type AssistantLayoutProps = PropsWithChildren<{
  tripQuery: FromToTripQuery;
}>;

function AssistantLayout({ children, tripQuery }: AssistantLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [searchTime, setSearchTime] = useState<SearchTime>(
    tripQuery.searchTime,
  );
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(tripQuery.transportModeFilter),
  );
  const [isSwapping, setIsSwapping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const setValuesWithLoading = async (override: Partial<FromToTripQuery>) => {
    setIsSearching(true);
    const query = createTripQuery(
      {
        ...tripQuery,
        ...override,
        searchTime,
      },
      transportModeFilter,
    );
    await router.push({ query });
    setIsSearching(false);
  };

  const onSwap = async () => {
    setIsSwapping(true);
    await setValuesWithLoading({
      from: tripQuery.to,
      to: tripQuery.from,
    });
    setIsSwapping(false);
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setValuesWithLoading({});
  };

  const onFromSelected = async (from: GeocoderFeature) =>
    setValuesWithLoading({ from });
  const onToSelected = async (to: GeocoderFeature) =>
    setValuesWithLoading({ to });

  return (
    <div>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={style.main}
        >
          <TabLink href={router.pathname} />

          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.input.label)}
            </Typo.p>
            <Search
              label={t(PageText.Assistant.search.input.from)}
              onChange={onFromSelected}
              selectedItem={tripQuery.from ?? undefined}
              button={
                <GeolocationButton
                  className={style.searchInputButton}
                  onGeolocate={onFromSelected}
                  onError={setGeolocationError}
                />
              }
            />
            <Search
              label={t(PageText.Assistant.search.input.to)}
              onChange={onToSelected}
              selectedItem={tripQuery.to ?? undefined}
              button={
                <SwapButton
                  className={style.searchInputButton}
                  onSwap={onSwap}
                  isLoading={isSwapping}
                />
              }
            />
          </div>
          <div className={style.date}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.date.label)}
            </Typo.p>

            <SearchTimeSelector
              initialState={searchTime}
              onChange={setSearchTime}
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
                {' '}
                <div className={style.alternatives}>
                  <div>
                    <Typo.p
                      textType="body__primary--bold"
                      className={style.heading}
                    >
                      {t(PageText.Assistant.search.filter.label)}
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
                ? t(PageText.Assistant.search.buttons.alternatives.less)
                : t(PageText.Assistant.search.buttons.alternatives.more)
            }
            className={style.button}
            mode="interactive_2"
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />

          <Button
            title={t(PageText.Assistant.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!tripQuery.from || !tripQuery.to}
            buttonProps={{ type: 'submit' }}
            state={isSearching ? 'loading' : undefined}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <EmptySearch
          isSearching={isSearching}
          isGeolocationError={geolocationError !== null}
          type="trip"
        >
          {children}
        </EmptySearch>
      </section>
    </div>
  );
}
export default AssistantLayout;
