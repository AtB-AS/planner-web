import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import {
  ZOOM_LEVEL,
  defaultPosition,
  getMapBounds,
  hasInitialPosition,
  hasMapLegs,
} from './utils';
import { useMapInteractions } from './use-map-interactions';
import { useFullscreenMap } from './use-fullscreen-map';
import { useMapPin } from './use-map-pin';
import { useMapLegs } from './use-map-legs';
import { and } from '@atb/utils/css';
import { MapLegType, Position } from './types';
import { useMapTariffZones } from './use-map-tariff-zones';
import useMediaQuery from '@atb/utils/user-media-query';

export type MapProps = {
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
} & (
  | {
      position: Position;
      initialZoom?: number;
    }
  | {
      mapLegs: MapLegType[];
    }
  | {}
);

export default function Map({ layer, onSelectStopPlace, ...props }: MapProps) {
  const mapWrapper = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();
  const { t } = useTranslation();
  const isMobileDevice = useMediaQuery('(max-width: 650px)');

  const mapLegs = hasMapLegs(props) ? props.mapLegs : undefined;
  const { position, initialZoom = ZOOM_LEVEL } = hasInitialPosition(props)
    ? props
    : { position: defaultPosition, initialZoom: ZOOM_LEVEL };
  const bounds = mapLegs ? getMapBounds(mapLegs) : undefined;

  const initializeMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;
    // If browsers doesn't support WebGL, don't initialize map
    if (!mapboxgl.supported()) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: mapboxData.accessToken,
      style: mapboxData.style,
      center: position,
      zoom: initialZoom,
      bounds, // If bounds is specified, it overrides center and zoom constructor options.
    });
  }, [position, initialZoom, bounds]);

  useEffect(() => {
    if (isMobileDevice) return;
    initializeMap();
    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { centerMap } = useMapInteractions(map, onSelectStopPlace);
  const { openFullscreen, closeFullscreen, isFullscreen } = useFullscreenMap(
    mapWrapper,
    map,
    initializeMap,
  );
  useMapPin(map, position, layer);
  useMapLegs(map, mapLegs);
  useMapTariffZones(map);

  useEffect(() => {
    if (!isMobileDevice) {
      initializeMap();
    }
  }, [isMobileDevice, initializeMap]);

  return (
    <div className={style.map} aria-hidden="true">
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
            icon={{ left: <MonoIcon icon="places/Location" /> }}
            onClick={() => centerMap(position)}
            buttonProps={{
              'aria-label': t(ComponentText.Map.map.centerMapButton),
            }}
          />
          <div
            ref={mapContainer}
            className={and(
              style.mapContainer,
              mapLegs && style.mapContainer__borderRadius,
            )}
          />
        </FocusScope>
      </div>
    </div>
  );
}
