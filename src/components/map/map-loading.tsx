import { ComponentText, useTranslation } from '@atb/translations';
import { Loading } from '../loading';
import style from './map.module.css';

export type MapLoadingProps = {};
export default function MapLoading({}: MapLoadingProps) {
  const { t } = useTranslation();
  return (
    <div className={style.mapLoading}>
      <Loading text={t(ComponentText.Map.loading)} />
    </div>
  );
}
