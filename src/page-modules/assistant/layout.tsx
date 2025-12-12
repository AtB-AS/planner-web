import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import EmptySearch from '@atb/components/loading-empty-results';
import { MessageBox } from '@atb/components/message-box';
import Search, { ClearButton, SwapButton } from '@atb/components/search';
import { Typo } from '@atb/components/typography';
import type { SearchTime } from '@atb/modules/search-time';
import SearchTimeSelector from '@atb/modules/search-time/selector';
import { TransportModeFilter } from '@atb/modules/transport-mode';
import type { GeocoderFeature } from '@atb/modules/geocoder';
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
import { getTransportModeFilter } from '@atb/modules/firebase/transport-mode-filter';
import useSWRImmutable from 'swr/immutable';
import { debounce } from 'lodash';
import LineFilter from './line-filter';
import { useTheme } from '@atb/modules/theme';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import { WalkSpeedInput } from './walk-speed-input';

export type AssistantLayoutProps = PropsWithChildren<{
  tripQuery: FromToTripQuery;
}>;

function AssistantLayout({ children, tripQuery }: AssistantLayoutProps) {
  const { t } = useTranslation();
  const { color } = useTheme();
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

  const onSetWalkSpeed = async (walkSpeed: number) =>
    setValuesWithLoading({ walkSpeed });

  return (
    <div className={style.wrapper}>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={[
            style.main,
            showAlternatives && style.removeBorderRadiusBottom,
          ].join(' ')}
        >
          <TabLink activePath="/assistant" />

          <div className={style.input}>
            <Typo.h2 textType="body__m__strong" className={style.heading}>
              {t(PageText.Assistant.search.input.label)}
            </Typo.h2>
            <div className={style.searchSection}>
              <Search
                label={t(PageText.Assistant.search.input.from)}
                placeholder={t(PageText.Assistant.search.input.placeholder)}
                onChange={onFromSelected}
                selectedItem={tripQuery.from ?? undefined}
                testID="searchFrom"
                onGeolocationError={setGeolocationError}
              />
              <Search
                label={t(PageText.Assistant.search.input.to)}
                placeholder={t(PageText.Assistant.search.input.placeholder)}
                onChange={onToSelected}
                selectedItem={tripQuery.to ?? undefined}
                testID="searchTo"
                autocompleteFocusPoint={tripQuery.from ?? undefined}
                onGeolocationError={setGeolocationError}
              />

              <SwapButton
                className={style.searchInputButton}
                onSwap={onSwap}
                isLoading={isSwapping}
              />
            </div>
          </div>
          <div className={style.date}>
            <Typo.h2 textType="body__m__strong" className={style.heading}>
              {t(PageText.Assistant.search.date.label)}
            </Typo.h2>
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
                  <WalkSpeedInput
                    onChange={onSetWalkSpeed}
                    initialValue={tripQuery.walkSpeed ?? undefined}
                  />
                  <LineFilter
                    filterState={tripQuery.lineFilter}
                    onChange={onLineFilterChanged}
                  />
                  <div>
                    <Typo.h3 textType="body__m" className={style.heading}>
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
                      testID="searchVia"
                      button={
                        tripQuery.via && (
                          <ClearButton
                            className={style.searchInputButton}
                            onClear={onClearViaLocation}
                          />
                        )
                      }
                      onGeolocationError={setGeolocationError}
                    />
                  </div>
                </div>
              </motion.div>
            </FocusScope>
          )}
        </AnimatePresence>
        <div
          className={[
            style.buttons,
            showAlternatives && style.removeAllBorderRadius,
          ].join(' ')}
        >
          <Button
            title={
              showAlternatives
                ? t(PageText.Assistant.search.buttons.alternatives.less)
                : t(PageText.Assistant.search.buttons.alternatives.more)
            }
            className={style.button}
            mode="secondary"
            backgroundColor={color.background.accent['0']}
            state={showAlternatives ? 'active' : 'none'}
            radiusSize="circular"
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />
          <Button
            title={t(PageText.Assistant.search.buttons.find.title)}
            className={style.button}
            mode={'primary'}
            radiusSize="circular"
            disabled={
              !tripQuery.from || !tripQuery.to || isPerformingSearchNavigation
            }
            buttonProps={{ type: 'submit' }}
            testID="findTravelsButton"
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <GlobalMessages context={GlobalMessageContextEnum.plannerWeb} />
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
