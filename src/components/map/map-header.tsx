import style from './map.module.css';
import { ButtonLink } from '@atb/components/button';
import { ComponentText, useTranslation } from '@atb/translations';
import { and } from '@atb/utils/css';
import { MonoIcon } from '@atb/components/icon';
import {
  type TransportModeType,
  transportModeToTranslatedString,
  getTransportModeIcon,
} from '@atb/modules/transport-mode';

export type MapHeaderProps = {
  id: string;
  name: string; // StopPlace name or address
  layer: 'address' | 'venue';
  transportModes?: TransportModeType[];
};

export function MapHeader({ id, name, layer, transportModes }: MapHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className={style.header}>
      <div className={style.header__leftContainer}>
        <div className={style.header__icons}>
          {layer === 'address' || !transportModes ? (
            <div>
              <MonoIcon size="large" icon="map/Pin" overrideMode="dark" />
            </div>
          ) : (
            transportModes.map((mode) => (
              <div key={`${mode}-icon`}>
                <MonoIcon
                  size="large"
                  overrideMode="dark"
                  icon={getTransportModeIcon({ mode })}
                  role="img"
                  alt={t(transportModeToTranslatedString({ mode }))}
                />
              </div>
            ))
          )}
        </div>
        <div className={style.header__info}>
          {layer === 'address' && (
            <p
              className={and(
                'typo-body__secondary',
                style['header__info__secondary'],
              )}
            >
              {t(ComponentText.Map.header.address)}
            </p>
          )}
          <h2 className={and('typo-heading--medium')}>{name}</h2>
        </div>
      </div>

      {layer === 'venue' && (
        <div className={style.header__buttons}>
          <ButtonLink
            mode="interactive_0"
            href={`/planner?travelFrom=${id}`}
            title={t(ComponentText.Map.button.travelFrom)}
            className={style.header__button}
          />
          <ButtonLink
            mode="interactive_0"
            href={`/planner?travelTo=${id}`}
            title={t(ComponentText.Map.button.travelTo)}
            className={style.header__button}
          />
        </div>
      )}
    </div>
  );
}
