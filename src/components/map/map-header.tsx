import style from './map.module.css';

import { ButtonLink } from '../button';
import { ComponentText, useTranslation } from '@atb/translations';
import VenueIcon, { FeatureCategory } from '../venue-icon';
import { MonoIcon } from '@atb/assets/mono-icon';
import { and } from '@atb/utils/css';

export type MapHeaderProps = {
  id: string;
  name: string; // StopPlace name or address
  layer: 'address' | 'venue';
  street?: string;
  category?: FeatureCategory[];
};

export function MapHeader({
  id,
  name,
  layer,
  street,
  category,
}: MapHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className={style.header}>
      <div className={style.header__leftContainer}>
        <div className={style.header__icons}>
          {layer === 'address' || !category ? (
            <div>
              <MonoIcon size="large" src="map/Pin.svg" overrideColor="white" />
            </div>
          ) : (
            category.map((type) => (
              <div key={[type, 'icon'].join('-')}>
                <VenueIcon
                  category={[type]}
                  size="large"
                  overrideColor="white"
                />
              </div>
            ))
          )}
        </div>
        <div className={style.header__info}>
          <h3
            className={and(
              'typo-heading--medium',
              layer === 'address' && style['flexOrder__2'],
            )}
          >
            {name}
          </h3>
          <p
            className={and(
              'typo-body__secondary',
              style['header__info__secondary'],
            )}
          >
            {layer === 'venue'
              ? t(ComponentText.Map.header.venue(street || '?')) // @TODO: better types
              : t(ComponentText.Map.header.address)}
          </p>
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
