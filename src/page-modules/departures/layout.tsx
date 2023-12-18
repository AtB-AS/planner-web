import { Button, ButtonLink } from '@atb/components/button';
import LoadingEmptySearch from '@atb/components/loading-empty-results';
import { MessageBox } from '@atb/components/message-box';
import Search from '@atb/components/search';
import GeolocationButton from '@atb/components/search/geolocation-button';
import { Typo } from '@atb/components/typography';
import { SearchTime, SearchTimeSelector } from '@atb/modules/search-time';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { useRouter } from 'next/router';
import { FormEventHandler, PropsWithChildren, useState } from 'react';
import style from './departures.module.css';
import type { FromDepartureQuery } from './types';
import { createFromQuery } from './utils';
import { TabLink } from '@atb/components/tab-link';
import { logSpecificEvent } from '@atb/modules/firebase/analytics';
import { getOrgData } from '@atb/modules/org-data';
import { MonoIcon } from '@atb/components/icon';

export type DeparturesLayoutProps = PropsWithChildren<{
  fromQuery: FromDepartureQuery;
}>;

function DeparturesLayout({ children, fromQuery }: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTime, setSearchTime] = useState<SearchTime>(
    fromQuery.searchTime,
  );
  const [isSearching, setIsSearching] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);

  const doSearch = async (override: Partial<FromDepartureQuery>) => {
    setIsSearching(true);
    const newRoute = createFromQuery({ ...fromQuery, ...override, searchTime });
    logSpecificEvent('search_departure');
    await router.push(newRoute);
    setIsSearching(false);
  };

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    return doSearch({});
  };

  const onSelectFeature = (feature: GeocoderFeature) =>
    doSearch({ from: feature });

  const { urls } = getOrgData();

  return (
    <div className={style.departuresPage}>
      <div className={style.homeLink__container}>
        <ButtonLink
          mode="transparent"
          href={urls.homePageUrl.href}
          title={t(PageText.Departures.homeLink(urls.homePageUrl.name))}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />
      </div>
      <form className={style.container} onSubmit={onSubmitHandler}>
        <div className={style.main}>
          <TabLink activePath="/departures" />

          <div className={style.input}>
            <Typo.p textType="body__primary--bold" className={style.heading}>
              {t(PageText.Departures.search.input.label)}
            </Typo.p>
            <Search
              label={t(PageText.Departures.search.input.from)}
              placeholder={t(PageText.Departures.search.input.placeholder)}
              selectedItem={fromQuery.from ?? undefined}
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
        </div>

        <div className={style.buttons}>
          <Button
            title={t(PageText.Departures.search.buttons.find.title)}
            className={style.button}
            mode="interactive_0--bordered"
            disabled={!fromQuery.from}
            buttonProps={{ type: 'submit' }}
            state={isSearching ? 'loading' : undefined}
          />
        </div>
      </form>

      <section className={style.contentContainer}>
        <LoadingEmptySearch
          isSearching={isSearching}
          isGeolocationError={geolocationError !== null}
          type={fromQuery.from?.layer === 'venue' ? 'stopPlace' : 'nearby'}
        >
          {children}
        </LoadingEmptySearch>
      </section>
    </div>
  );
}

export default DeparturesLayout;
