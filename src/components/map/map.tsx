import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import Button from '../button/button';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import { MapLegType } from '@atb/page-modules/departures/server/journey-planner/validators';
import { useTheme } from '@atb/modules/theme';
import { LngLatPosition, ZOOM_LEVEL, defaultPosition } from './utils';
import { useMapInteractions } from './use-map-interactions';
import { useFullscreenMap } from './use-fullscreen-map';
import { useMapPin } from './use-map-pin';
import { useMapLegs } from './use-map-legs';
import { and } from '@atb/utils/css';

export type MapProps = {
  position?: LngLatPosition;
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
  mapLegs?: MapLegType[];
  initialZoom?: number;
};

export function Map({
  position = defaultPosition,
  layer,
  onSelectStopPlace,
  mapLegs,
  initialZoom = ZOOM_LEVEL,
}: MapProps) {
  const { transport } = useTheme();
  const mapWrapper = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: mapboxData.accessToken,
      style: mapboxData.style,
      center: position,
      zoom: initialZoom,
    });

    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { centerMap } = useMapInteractions(map, onSelectStopPlace);
  const { openFullscreen, closeFullscreen, isFullscreen } = useFullscreenMap(
    mapWrapper,
    map,
  );
  useMapPin(map, position, layer);
  useMapLegs(map, transport, mapLegs);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: position,
        zoom: initialZoom,
        speed: 2,
      });
    }
  }, [position, initialZoom]);

  return (
    <div className={style.map}>
      <Button
        className={style.fullscreenButton}
        title={t(ComponentText.Map.map.openFullscreenButton)}
        icon={{ left: <MonoIcon icon="map/Map" /> }}
        onClick={openFullscreen}
      />

      <div className={style.mapWrapper} ref={mapWrapper}>
        <FocusScope
          contain={isFullscreen}
          restoreFocus
          autoFocus={isFullscreen}
        >
          <Button
            className={style.closeButton}
            onClick={closeFullscreen}
            size="small"
            icon={{
              left: (
                <MonoIcon icon="navigation/ArrowLeft" overrideMode="dark" />
              ),
            }}
            mode="interactive_0"
            buttonProps={{
              'aria-label': t(ComponentText.Map.map.closeFullscreenButton),
            }}
          />
          <Button
            className={style.buttonsContainer}
            size="small"
            icon={{ left: <MonoIcon icon="places/City" /> }}
            onClick={() => centerMap(position)}
            buttonProps={{
              'aria-label': t(ComponentText.Map.map.centerMapButton),
            }}
          />
          <div
            ref={mapContainer}
            className={and(
              style.mapContainer,
              mapLegs ? style.borderRadius : style.borderRadius__top,
            )}
          />
        </FocusScope>
      </div>
    </div>
  );
}
