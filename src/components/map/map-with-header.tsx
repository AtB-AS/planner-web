import style from './map.module.css';
import { MapHeader, Map } from '.';
import { MapHeaderProps } from './map-header';
import { MapProps } from './map';

export type MapWithHeaderProps = MapHeaderProps & MapProps;

export function MapWithHeader({ ...props }: MapWithHeaderProps) {
  return (
    <div className={style.mapWithHeader}>
      <MapHeader {...props} />
      <Map {...props} />
    </div>
  );
}
