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
    let query = {};
    const filter = filterToQueryString(transportModeFilter);

    if (filter) {
      query = {
        filter,
      };
    }

    const arriveBy = departureDate.type === DepartureDateState.Arrival;
    if (arriveBy) {
      query = {
        ...query,
        arriveBy,
      };
    }

    const when = departureDate.type !== DepartureDateState.Now;
    if (when) {
      query = {
        ...query,
        when: departureDate.dateTime,
      };
    }
    const fromToQuery = featuresToFromToQuery(
      selectedToFeature,
      selectedFromFeature,
    );

    router.push({
      pathname: `/assistant`,
      query: {
        ...query,
        ...fromToQuery,
      },
    });
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    let query = {};

    const filter = filterToQueryString(transportModeFilter);

    if (filter) {
      query = {
        filter,
      };
    }

    const arriveBy = departureDate.type === DepartureDateState.Arrival;
    if (arriveBy) {
      query = {
        ...query,
        arriveBy,
      };
    }

    const when = departureDate.type !== DepartureDateState.Now;
    if (when) {
      query = {
        ...query,
        when: departureDate.dateTime,
      };
    }

    const fromToQuery = featuresToFromToQuery(
      selectedFromFeature,
      selectedToFeature,
    );

    router.push({
      pathname: `/assistant`,
      query: {
        ...query,
        ...fromToQuery,
      },
    });
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
              initialQuery={
                initialFromFeature?.name
                  ? `${initialFromFeature.name}, ${initialFromFeature.locality}`
                  : ''
              }
            />
            <Search
              label={t(PageText.Assistant.search.input.to)}
              onChange={setSelectedToFeature}
              initialQuery={
                initialToFeature?.name
                  ? `${initialToFeature.name}, ${initialToFeature.locality}`
                  : ''
              }
              onSwap={onSwap}
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