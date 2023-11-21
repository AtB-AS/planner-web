import { Button } from '@atb/components/button';
import EmptySearch from '@atb/components/empty-search';
import { MonoIcon } from '@atb/components/icon';
import Search, { GeolocationButton, SwapButton } from '@atb/components/search';
import { Typo } from '@atb/components/typography';
import type { SearchTime } from '@atb/modules/search-time';
import SearchTimeSelector from '@atb/modules/search-time/selector';
import {
  TransportModeFilter,
  getInitialTransportModeFilter,
  type TransportModeFilterOption,
} from '@atb/modules/transport-mode';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import style from './assistant.module.css';
import { createTripQuery } from './utils';

export type AssistantLayoutProps = PropsWithChildren<{
  initialFromFeature?: GeocoderFeature;
  initialToFeature?: GeocoderFeature;
  initialTransportModesFilter?: TransportModeFilterOption[] | null;
  initialSearchTime?: SearchTime;
}>;

function AssistantLayout({
  children,
  initialFromFeature,
  initialToFeature,
  initialTransportModesFilter,
  initialSearchTime,
}: AssistantLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedFromFeature, setSelectedFromFeature] = useState<
    GeocoderFeature | undefined
  >(initialFromFeature);
  const [selectedToFeature, setSelectedToFeature] = useState<
    GeocoderFeature | undefined
  >(initialToFeature);
  const [searchTime, setSearchTime] = useState<SearchTime>(
    initialSearchTime ?? { mode: 'now' },
  );
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(initialTransportModesFilter),
  );
  const [isSwapping, setIsSwapping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const onSwap = async () => {
    if (!selectedToFeature || !selectedFromFeature) return;
    setIsSwapping(true);
    const query = createTripQuery(
      selectedToFeature,
      selectedFromFeature,
      searchTime,
      transportModeFilter,
    );
    const temp = selectedFromFeature;
    setSelectedFromFeature(selectedToFeature);
    setSelectedToFeature(temp);
    setIsSwapping(false);

    setIsSearching(true);
    await router.push({ pathname: '/assistant', query });
    setIsSearching(false);
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!selectedFromFeature || !selectedToFeature) return;
    setIsSearching(true);
    const query = createTripQuery(
      selectedFromFeature,
      selectedToFeature,
      searchTime,
      transportModeFilter,
    );
    await router.push({ pathname: '/assistant', query });
    setIsSearching(false);
  };

  return (
    <div>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <motion.div
          animate={{ paddingBottom: showAlternatives ? '1.5rem' : '5.75rem' }}
          initial={{ paddingBottom: '5.75rem' }}
          transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
          className={style.main}
        >
          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.input.label)}
            </Typo.p>

            <Search
              label={t(PageText.Assistant.search.input.from)}
              onChange={setSelectedFromFeature}
              initialFeature={initialFromFeature}
              selectedItem={selectedFromFeature}
              button={
                <GeolocationButton
                  className={style.searchInputButton}
                  onGeolocate={setSelectedFromFeature}
                />
              }
            />
            <Search
              label={t(PageText.Assistant.search.input.to)}
              onChange={setSelectedToFeature}
              initialFeature={initialToFeature}
              selectedItem={selectedToFeature}
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
            title={t(PageText.Assistant.search.buttons.alternatives.title)}
            className={style.button}
            mode="interactive_2"
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />

          <Button
            title={t(PageText.Assistant.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!selectedFromFeature || !selectedToFeature}
            buttonProps={{ type: 'submit' }}
            state={isSearching ? 'loading' : undefined}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <EmptySearch isSearching={isSearching} type="trip">
          {children}
        </EmptySearch>
      </section>
    </div>
  );
}

export default AssistantLayout;
