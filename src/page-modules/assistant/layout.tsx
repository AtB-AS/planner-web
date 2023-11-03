import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import Search from '@atb/components/search';
import { Button } from '@atb/components/button';
import style from './assistant.module.css';
import { useRouter } from 'next/router';
import DepartureDateSelector, {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import TransportModeFilter from '@atb/components/transport-mode-filter';
import { Typo } from '@atb/components/typography';
import { getInitialTransportModeFilter } from '@atb/components/transport-mode-filter/utils';
import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { MonoIcon } from '@atb/components/icon';
import { FocusScope } from '@react-aria/focus';
import {
  createTripQuery,
  departureDateToDepartureMode,
  DepartureMode,
  departureModeToDepartureDate,
} from '@atb/page-modules/assistant';
import SwapButton from '@atb/components/search/swap-button';
import GeolocationButton from '@atb/components/search/geolocation-button';
import { AnimatePresence, motion } from 'framer-motion';

export type AssistantLayoutProps = PropsWithChildren<{
  initialFromFeature?: GeocoderFeature;
  initialToFeature?: GeocoderFeature;
  initialTransportModesFilter?: TransportModeFilterOption[] | null;
  departureMode?: DepartureMode;
  departureDate?: number | null;
}>;

function AssistantLayout({
  children,
  initialFromFeature,
  initialToFeature,
  initialTransportModesFilter,
  departureMode,
  departureDate: initialDepartureDate,
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
  const [departureDate, setDepartureDate] = useState<DepartureDate>(
    departureModeToDepartureDate(departureMode, initialDepartureDate),
  );
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(initialTransportModesFilter),
  );
  const [isSwapping, setIsSwapping] = useState(false);

  const onSwap = () => {
    if (!selectedToFeature || !selectedFromFeature) return;
    setIsSwapping(true);
    const query = createTripQuery(
      selectedToFeature,
      selectedFromFeature,
      departureDateToDepartureMode(departureDate),
      departureDate.type !== DepartureDateState.Now
        ? departureDate.dateTime
        : undefined,
      transportModeFilter,
    );
    const temp = selectedFromFeature;
    setSelectedFromFeature(selectedToFeature);
    setSelectedToFeature(temp);
    router
      .push({ pathname: '/assistant', query })
      .then(() => setIsSwapping(false));
  };

  const onGeolocate = (geolocationFeature: GeocoderFeature) => {
    if (!selectedToFeature) return;
    const query = createTripQuery(
      geolocationFeature,
      selectedToFeature,
      departureDateToDepartureMode(departureDate),
      departureDate.type !== DepartureDateState.Now
        ? departureDate.dateTime
        : undefined,
      transportModeFilter,
    );
    setSelectedFromFeature(geolocationFeature);
    router.push({ pathname: '/assistant', query });
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!selectedFromFeature || !selectedToFeature) return;
    const query = createTripQuery(
      selectedFromFeature,
      selectedToFeature,
      departureDateToDepartureMode(departureDate),
      departureDate.type !== DepartureDateState.Now
        ? departureDate.dateTime
        : undefined,
      transportModeFilter,
    );
    router.push({ pathname: '/assistant', query });
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
                  onGeolocate={onGeolocate}
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

            <DepartureDateSelector
              initialState={departureDate}
              onChange={setDepartureDate}
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
            mode={showAlternatives ? 'interactive_3' : 'interactive_2'}
            onClick={() => setShowAlternatives(!showAlternatives)}
            icon={{ right: <MonoIcon icon="actions/Adjust" /> }}
          />

          <Button
            title={t(PageText.Assistant.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!selectedFromFeature || !selectedToFeature}
            buttonProps={{ type: 'submit' }}
          />
        </div>
      </form>

      <section className={style.contentContainer}>{children}</section>
    </div>
  );
}

export default AssistantLayout;
