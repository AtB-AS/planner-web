import type { WithGlobalData } from '@atb/layouts/global-data';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import Search from '@atb/components/search';
import { Button } from '@atb/components/button';
import style from './departures.module.css';
import { useRouter } from 'next/router';
import DepartureDateSelector, {
  DepartureDate,
  DepartureDateState,
} from '@atb/components/departure-date-selector';
import TransportModeFilter from '../../components/transport-mode-filter';
import { Typo } from '@atb/components/typography';
import {
  filterToQueryString,
  getInitialTransportModeFilter,
} from '@atb/components/transport-mode-filter/utils';

export type DeparturesLayoutProps = PropsWithChildren<WithGlobalData<{}>>;

function DeparturesLayout({ children }: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<GeocoderFeature>();
  const [departureDate, setDepartureDate] = useState<DepartureDate>({
    type: DepartureDateState.Now,
  });
  const [transportModeFilter, setTransportModeFilter] = useState(
    getInitialTransportModeFilter(),
  );

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    let query = {};

    const filter = filterToQueryString(transportModeFilter);

    if (filter) {
      query = {
        filter,
      };
    }

    if (selectedFeature?.layer == 'venue') {
      // TODO: Using URL object encodes all query params
      router.push({
        pathname: `/departures/[[...id]]`,
        query: { ...query, id: selectedFeature.id },
      });
    } else if (selectedFeature?.layer == 'address') {
      const [lon, lat] = selectedFeature.geometry.coordinates;
      router.push({
        href: '/departures',
        query: {
          ...query,
          lon,
          lat,
        },
      });
    }
  };

  return (
    <div className={style.departuresPage}>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <div className={style.main}>
          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.input.label)}
            </Typo.p>

            <Search
              label={t(PageText.Departures.search.input.from)}
              onChange={setSelectedFeature}
            />
          </div>

          <div className={style.date}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.date.label)}
            </Typo.p>

            <DepartureDateSelector
              initialState={departureDate}
              onChange={setDepartureDate}
            />
          </div>
        </div>

        <div className={style.alternativesWrapper}>
          <div className={style.alternatives}>
            <div>
              <Typo.p textType="body__primary--bold" className={style.heading}>
                {t(PageText.Departures.search.filter.label)}
              </Typo.p>

              <TransportModeFilter
                filterState={transportModeFilter}
                onFilterChange={setTransportModeFilter}
              />
            </div>
          </div>
        </div>

        <div className={style.buttons}>
          <Button
            title={t(PageText.Departures.search.button.title)}
            className={style.button}
            mode="interactive_0"
            disabled={!selectedFeature}
            buttonProps={{ type: 'submit' }}
          />
        </div>
      </form>

      <section className={style.contentContainer}>{children}</section>
    </div>
  );
}

export default DeparturesLayout;
