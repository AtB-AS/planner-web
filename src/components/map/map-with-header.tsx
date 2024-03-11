import style from './map.module.css';
import { MapHeader, MapHeaderProps } from './map-header';
import Map, { MapProps } from './map';

export type MapWithHeaderProps = MapHeaderProps & MapProps;

export function MapWithHeader({ ...props }: MapWithHeaderProps) {
  return (
    <div className={style.mapWithHeader}>
      <MapHeader {...props} />
      <Map {...props} />
    </div>
  );
}
