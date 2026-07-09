import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import {
  ZOOM_LEVEL,
  defaultPosition,
  getMapBounds,
  hasInitialPosition,
  hasMapLegs,
} from './utils';
import { useMapInteractions } from './use-map-interactions';
import { useMapPin } from './use-map-pin';
import { useMapLegs } from './use-map-legs';
import { and } from '@atb/utils/css';
import { MapLegType, PositionType } from './types';
import { useMapFareZones } from './use-map-fare-zones';
import { logSpecificEvent } from '@atb/modules/firebase';

export type MapProps = {
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
  interactive?: boolean;
} & (
  | { position?: PositionType; initialZoom?: number }
  | { mapLegs: MapLegType[] }
  | {}
);

export default function Map({
  layer,
  onSelectStopPlace,
  interactive = true,
  ...props
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | undefined>(undefined);
  const { t } = useTranslation();

  const mapLegs = hasMapLegs(props) ? props.mapLegs : undefined;
  const { position, initialZoom = ZOOM_LEVEL } = hasInitialPosition(props)
    ? props
    : { position: defaultPosition, initialZoom: ZOOM_LEVEL };
  const bounds = mapLegs ? getMapBounds(mapLegs) : undefined;

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;
    if (!mapboxgl.supported()) return;
    logSpecificEvent('initialize_map');
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: mapboxData.accessToken,
      style: mapboxData.style,
      center: position,
      zoom: initialZoom,
      bounds,
      interactive,
    });
  }, [position, initialZoom, bounds, interactive]);

  useEffect(() => {
    initializeMap();
    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { centerMap } = useMapInteractions(map, onSelectStopPlace);
  useMapPin(map, position, layer);
  useMapLegs(map, mapLegs);
  useMapFareZones(map);

  return (
    <div className={style.map}>
      <div className={style.mapWrapper}>
        {interactive && (
          <Button
            className={style.buttonsContainer}
            size="small"
            icon={{ left: <MonoIcon icon="places/Location" /> }}
            onClick={() => centerMap(position)}
            buttonProps={{
              'aria-label': t(ComponentText.Map.map.centerMapButton),
            }}
          />
        )}
        <div
          ref={mapContainer}
          aria-hidden="true"
          className={and(
            style.mapContainer,
            mapLegs && style.mapContainer__borderRadius,
          )}
        />
      </div>
    </div>
  );
}
