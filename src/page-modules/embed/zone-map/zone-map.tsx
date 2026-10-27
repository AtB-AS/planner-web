import { Map } from '@atb/components/map';
import style from './zone-map.module.css';

export function ZoneMap() {
  return (
    <div className={style.zoneMap}>
      <Map />
    </div>
  );
}
