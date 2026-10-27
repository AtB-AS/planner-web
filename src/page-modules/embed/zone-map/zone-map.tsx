import { Map } from '@atb/components/map';
import style from './zone-map.module.css';
import type { ZoneMapOptions } from './utils';

export type ZoneMapProps = ZoneMapOptions;

export function ZoneMap({ position, zoom }: ZoneMapProps) {
  return (
    <div className={style.zoneMap}>
      <Map position={position} initialZoom={zoom} />
    </div>
  );
}
