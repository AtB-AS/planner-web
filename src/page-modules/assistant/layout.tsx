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
import {
  filterToQueryString,
  getInitialTransportModeFilter,
} from '@atb/components/transport-mode-filter/utils';
import { TransportModeFilterOption } from '@atb/components/transport-mode-filter/types';
import { MonoIcon } from '@atb/components/icon';
import { FocusScope } from '@react-aria/focus';
import { featuresToFromToQuery } from './utils';
import SwapButton from '@atb/components/search/swap-button';
import GeolocationButton from '@atb/components/search/geolocation-button';

export type AssistantLayoutProps = PropsWithChildren<{
  initialFromFeature?: GeocoderFeature;
  initialToFeature?: GeocoderFeature;
  initialTransportModesFilter?: TransportModeFilterOption[] | null;
}>;

function AssistantLayout({
  children,
  initialFromFeature,
  initialToFeature,
  initialTransportModesFilter,
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
  const [departureDate, setDepartureDate] = useState<DepartureDate>({
    type: DepartureDateState.Now,
  });
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(initialTransportModesFilter),
  );

  const onSwap = () => {
    if (!selectedToFeature || !selectedFromFeature) return;
    const query = createQuery(selectedToFeature, selectedFromFeature);
    const temp = selectedFromFeature;
    setSelectedFromFeature(selectedToFeature);
    setSelectedToFeature(temp);
    router.push({ pathname: '/assistant', query });
  };

  const onGeolocate = (geolocationFeature: GeocoderFeature) => {
    if (!selectedToFeature) return;
    const query = createQuery(geolocationFeature, selectedToFeature);
    setSelectedFromFeature(geolocationFeature);
    router.push({ pathname: '/assistant', query });
  };

  const createQuery = (
    fromFeature: GeocoderFeature,
    toFeature: GeocoderFeature,
  ) => {
    const filter = filterToQueryString(transportModeFilter);
    const arriveBy = departureDate.type === DepartureDateState.Arrival;
    const departBy = departureDate.type === DepartureDateState.Departure;
    const fromToQuery = featuresToFromToQuery(fromFeature, toFeature);

    const query = {
      ...(filter ? { filter } : {}),
      ...(arriveBy ? { arriveBy: departureDate.dateTime } : {}),
      ...(departBy ? { departBy: departureDate.dateTime } : {}),
      ...fromToQuery,
    };

    return query;
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!selectedFromFeature || !selectedToFeature) return;
    const query = createQuery(selectedFromFeature, selectedToFeature);
    router.push({ pathname: '/assistant', query });
  };

  return (
    <div>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <div className={style.main}>
          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Assistant.search.input.label)}
            </Typo.p>

            <Search
              label={t(PageText.Assistant.search.input.from)}
              onChange={setSelectedFromFeature}
              initialFeature={initialFromFeature}
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
              button={
                <SwapButton
                  className={style.searchInputButton}
                  onSwap={onSwap}
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
        </div>

        {showAlternatives && (
          <FocusScope contain={false} autoFocus={showAlternatives}>
            <div className={style.alternativesWrapper}>
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
            </div>
          </FocusScope>
        )}

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
