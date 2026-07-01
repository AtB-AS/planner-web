import Link from 'next/link';
import { useState } from 'react';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import { and, andIf } from '@atb/utils/css';
import { Map } from './dynamic-map';
import { MapLegType } from './types';
import style from './mini-map.module.css';

type MiniMapProps = {
  mapLegs: MapLegType[];
  href: string;
};

export function MiniMap({ mapLegs, href }: MiniMapProps) {
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={style.miniMapButton}
        onClick={() => setIsMobileOpen((v) => !v)}
        aria-expanded={isMobileOpen}
      >
        <MonoIcon icon="map/Map" />
        <span>
          {t(
            isMobileOpen
              ? ComponentText.Map.map.hideMap
              : ComponentText.Map.map.showMap,
          )}
        </span>
      </button>
      <Link
        href={href}
        className={and(
          style.miniMap,
          andIf({ [style.miniMap__mobileOpen]: isMobileOpen }),
        )}
        aria-hidden="true"
        tabIndex={-1}
      >
        <Map mapLegs={mapLegs} interactive={false} aria-hidden />
      </Link>
    </>
  );
}
