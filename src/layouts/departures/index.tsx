import type { WithGlobalData } from '@atb/layouts/global-data';
import type { GeocoderFeature } from '@atb/page-modules/departures';
import { PageText, useTranslation } from '@atb/translations';
import { PropsWithChildren, useState } from 'react';
import Search from '@atb/components/search';
import { Button } from '@atb/components/button';
import style from './departures.module.css';
import { useRouter } from 'next/router';

export type DeparturesLayoutProps = PropsWithChildren<WithGlobalData<{}>>;
function DeparturesLayout({ children }: DeparturesLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedFeature, setSelectedFeature] = useState<GeocoderFeature>();

  return (
    <div className={style.departuresPage}>
      <div className={style.searchWrapper}>
        <div className={style.searchContainer}>
          <p className={style.searchInputLabel}>
            {t(PageText.Departures.search.input.label)}
          </p>

          <Search
            label={t(PageText.Departures.search.input.from)}
            onChange={setSelectedFeature}
          />

          <Button
            title={t(PageText.Departures.search.button.title)}
            className={style.searchButton}
            mode={'interactive_0'}
            disabled={!selectedFeature}
            onClick={() => {
              if (selectedFeature) {
                router.push(`/departures/${selectedFeature.id}`);
              }
            }}
          />
        </div>
      </div>

      {children}
    </div>
  );
}

export default DeparturesLayout;
