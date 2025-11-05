import style from './map.module.css';
import { ButtonLink } from '@atb/components/button';
import { ComponentText, useTranslation } from '@atb/translations';
import { and } from '@atb/utils/css';
import { MonoIcon } from '@atb/components/icon';

import {
  transportModeToTranslatedString,
  getTransportModeIcon,
  TransportModeType,
  TransportIcon,
} from '@atb/modules/transport-mode';

export type MapHeaderProps = {
  name: string; // StopPlace name or address
  layer: 'address' | 'venue';
  transportModes?: TransportModeType[];
  position?: { lat: number; lon: number };
};

export function MapHeader({
  name,
  layer,
  transportModes,
  position,
}: MapHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className={style.header}>
      <div className={style.header__leftContainer}>
        <div className={style.header__icons}>
          {layer === 'address' || !transportModes ? (
            <div>
              <MonoIcon size="large" icon="map/Pin" />
            </div>
          ) : (
            transportModes.map((transportMode) => (
              <div key={`${transportMode}-icon`}>
                <TransportIcon
                  mode={{
                    transportMode: transportMode,
                  }}
                  size="large"
                />
              </div>
            ))
          )}
        </div>
        <div className={style.header__info}>
          {layer === 'address' && (
            <p
              className={and('typo-body__s', style['header__info__secondary'])}
            >
              {t(ComponentText.Map.header.address)}
            </p>
          )}
          <h2 className={and('typo-heading__l')}>{name}</h2>
        </div>
      </div>

      {layer === 'venue' && position && (
        <div className={style.header__buttons}>
          <ButtonLink
            mode="primary"
            radiusSize="circular"
            href={`/assistant?fromName=${name}&fromLat=${position.lat}&fromLon=${position.lon}&fromLayer=${layer}`}
            title={t(ComponentText.Map.button.travelFrom)}
            className={style.header__button}
          />
          <ButtonLink
            mode="primary"
            radiusSize="circular"
            href={`/assistant?toName=${name}&toLat=${position.lat}&toLon=${position.lon}&toLayer=${layer}`}
            title={t(ComponentText.Map.button.travelTo)}
            className={style.header__button}
          />
        </div>
      )}
    </div>
  );
}
