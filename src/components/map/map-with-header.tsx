import style from './map.module.css';
import { MapHeader, MapHeaderProps } from './map-header';
import { MapProps } from './map';
import { Map } from './dynamic-map';

export type MapWithHeaderProps = MapHeaderProps & MapProps;

export function MapWithHeader({ ...props }: MapWithHeaderProps) {
  return (
    <div className={style.mapWithHeader} data-testid="mapContainer">
      <MapHeader {...props} />
      <Map {...props} />
    </div>
  );
}
