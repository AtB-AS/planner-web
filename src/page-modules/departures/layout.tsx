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

export type DeparturesLayoutProps = PropsWithChildren<{
  initialSelectedFeature?: GeocoderFeature;
}>;

function DeparturesLayout({
  children,
  initialSelectedFeature,
}: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<
    GeocoderFeature | undefined
  >(initialSelectedFeature);
  const [departureDate, setDepartureDate] = useState<DepartureDate>({
    type: DepartureDateState.Now,
  });

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (selectedFeature?.layer == 'venue') {
      router.push(`/departures/${selectedFeature.id}`);
    } else if (selectedFeature?.layer == 'address') {
      const [lon, lat] = selectedFeature.geometry.coordinates;
      router.push({
        href: '/departures',
        query: {
          lon,
          lat,
        },
      });
    }
  };

  return (
    <div className={style.departuresPage}>
      <div className={style.searchWrapper}>
        <form className={style.searchContainer} onSubmit={onSubmitHandler}>
          <div className={style.searchInput}>
            <p className={style.searchInputLabel}>
              {t(PageText.Departures.search.input.label)}
            </p>

            <Search
              label={t(PageText.Departures.search.input.from)}
              onChange={setSelectedFeature}
              initialQuery={
                !selectedFeature
                  ? undefined
                  : `${selectedFeature.name}, ${selectedFeature.locality}`
              }
            />
          </div>

          <div className={style.searchDate}>
            <p className={style.searchInputLabel}>
              {t(PageText.Departures.search.date.label)}
            </p>

            <DepartureDateSelector
              initialState={departureDate}
              onChange={setDepartureDate}
            />
          </div>

          <Button
            title={t(PageText.Departures.search.button.title)}
            className={style.searchButton}
            mode="interactive_0"
            disabled={!selectedFeature}
            buttonProps={{ type: 'submit' }}
          />
        </form>
      </div>

      {children}
    </div>
  );
}

export default DeparturesLayout;
