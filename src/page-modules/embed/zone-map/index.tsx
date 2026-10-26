import { Map, defaultPosition } from '@atb/components/map';
import { useHtmlDarkMode } from '@atb/modules/theme';
import {
  FixedLanguageProvider,
  Language,
  PageText,
  useTranslation,
} from '@atb/translations';
import Head from 'next/head';
import { useCallback } from 'react';
import type { ZoneMapQuery } from './utils';
import style from './zone-map.module.css';

export { parseZoneMapQuery } from './utils';

// Starting zoom before the fare zones are loaded and the map fits to them.
const FARE_ZONES_INITIAL_ZOOM = 7;

// Language follows the visitor's browser, since cookies are not available
// in a cross-site iframe.
export type ZoneMapProps = ZoneMapQuery & {
  language: Language;
};

export function ZoneMap({ language, initialView }: ZoneMapProps) {
  return (
    <FixedLanguageProvider language={language}>
      <ZoneMapContent initialView={initialView} />
    </FixedLanguageProvider>
  );
}

function ZoneMapContent({ initialView }: Pick<ZoneMapProps, 'initialView'>) {
  useHtmlDarkMode();
  const { t } = useTranslation();

  // The map is embedded on other sites, so open departures in a new tab
  // instead of navigating inside the iframe.
  const onSelectStopPlace = useCallback((id: string) => {
    window.open(`/departures/${id}`, '_blank', 'noopener');
  }, []);

  return (
    <div className={style.zoneMap}>
      <Head>
        <title>{t(PageText.zoneMapPageTitle)}</title>
        <meta name="robots" content="noindex" />
      </Head>
      {initialView ? (
        <Map
          position={initialView.position}
          initialZoom={initialView.zoom}
          onSelectStopPlace={onSelectStopPlace}
        />
      ) : (
        <Map
          position={defaultPosition}
          initialZoom={FARE_ZONES_INITIAL_ZOOM}
          fitToFareZones
          onSelectStopPlace={onSelectStopPlace}
        />
      )}
    </div>
  );
}
