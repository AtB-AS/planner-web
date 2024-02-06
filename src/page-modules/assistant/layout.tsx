import { Button, ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import EmptySearch from '@atb/components/loading-empty-results';
import { MessageBox } from '@atb/components/message-box';
import Search, {
  ClearButton,
  GeolocationButton,
  SwapButton,
} from '@atb/components/search';
import { Typo } from '@atb/components/typography';
import type { SearchTime } from '@atb/modules/search-time';
import SearchTimeSelector from '@atb/modules/search-time/selector';
import { TransportModeFilter } from '@atb/modules/transport-mode';
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
import { logSpecificEvent } from '@atb/modules/firebase';
import { getOrgData } from '@atb/modules/org-data';
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter';
import useSWRImmutable from 'swr/immutable';
import { debounce } from 'lodash';
import LineFilter from './line-filter';

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
  const [isSwapping, setIsSwapping] = useState(false);
  const [isPerformingSearchNavigation, setIsPerformingSearchNavigation] =
    useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  // Loading the transport mode filter data here instead of in the component
  // avoids the data loading when the filter is mounted which causes the
  // height to be incorrect and the animation to be janky.
  const { data: transportModeFilter } = useSWRImmutable(
    'transportModeFilter',
    getTransportModeFilter,
  );

  const setValuesWithLoading = async (
    override: Partial<FromToTripQuery>,
    replace = false,
  ) => {
    const query = createTripQuery({
      ...tripQuery,
      ...override,
      searchTime,
    });

    // Only show loading if we have both from and to selected.
    if ((tripQuery.from && query.toId) || (tripQuery.to && query.fromId)) {
      setIsPerformingSearchNavigation(true);
    }

    logSpecificEvent('search_assistant');

    if (replace) {
      await router.replace({ query });
    } else {
      await router.push({ query });
    }
    setIsPerformingSearchNavigation(false);
  };

  const onSwap = async () => {
    setIsSwapping(true);
    await setValuesWithLoading({
      from: tripQuery.to,
      to: tripQuery.from,
    });
    setIsSwapping(false);
  };

  const onClearViaLocation = () => {
    setValuesWithLoading({ ...tripQuery, via: null });
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await setValuesWithLoading({});
  };

  const onFromSelected = async (from: GeocoderFeature) =>
    setValuesWithLoading({ from });
  const onToSelected = async (to: GeocoderFeature) =>
    setValuesWithLoading({ to });
  const onTransportFilterChanged = debounce(
    async (transportModeFilter: string[] | null) =>
      setValuesWithLoading({ transportModeFilter }, true),
    500,
  );
  const onViaSelected = async (via: GeocoderFeature) =>
    setValuesWithLoading({ via });
  const onLineFilterChanged = debounce(
    async (lineFilter: string[] | null) =>
      setValuesWithLoading({ lineFilter }, true),
    750,
  );

  const { urls } = getOrgData();

  return (
    <div>
      <div className={style.homeLink__container}>
        <ButtonLink
          mode="transparent"
          href={urls.homePageUrl.href}
          title={t(PageText.Assistant.homeLink(urls.homePageUrl.name))}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />{' '}
      </div>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={style.main}
        >
          <TabLink activePath="/assistant" />

          <div className={style.input}>
            <Typo.h3 textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.input.label)}
            </Typo.h3>
            <Search
              label={t(PageText.Assistant.search.input.from)}
              placeholder={t(PageText.Assistant.search.input.placeholder)}
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
              placeholder={t(PageText.Assistant.search.input.placeholder)}
              onChange={onToSelected}
              selectedItem={tripQuery.to ?? undefined}
              button={
                <SwapButton
                  className={style.searchInputButton}
                  onSwap={onSwap}
                  isLoading={isSwapping}
                />
              }
              autocompleteFocusPoint={tripQuery.from ?? undefined}
            />
          </div>
          <div className={style.date}>
            <Typo.h3 textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.date.label)}
            </Typo.h3>
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
                <div className={style.alternatives}>
                  <TransportModeFilter
                    filterState={tripQuery.transportModeFilter}
                    data={transportModeFilter}
                    onChange={onTransportFilterChanged}
                  />

                  <div>
                    <Typo.h3
                      textType="body__primary--bold"
                      className={style.heading}
                    >
                      {t(PageText.Assistant.search.input.via.label)}
                    </Typo.h3>
                    <Search
                      label={t(PageText.Assistant.search.input.via.description)}
                      placeholder={t(
                        PageText.Assistant.search.input.placeholder,
                      )}
                      onChange={onViaSelected}
                      selectedItem={tripQuery.via ?? undefined}
                      autocompleteFocusPoint={tripQuery.via ?? undefined}
                      button={
                        tripQuery.via && (
                          <ClearButton
                            className={style.searchInputButton}
                            onClear={onClearViaLocation}
                          />
                        )
                      }
                    />
                  </div>

                  <LineFilter
                    filterState={tripQuery.lineFilter}
                    onChange={onLineFilterChanged}
                  />
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
            mode="interactive_0--bordered"
            disabled={
              !tripQuery.from || !tripQuery.to || isPerformingSearchNavigation
            }
            buttonProps={{ type: 'submit' }}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <EmptySearch
          isSearching={false}
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
