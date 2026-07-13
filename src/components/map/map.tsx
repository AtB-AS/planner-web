import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl, { type StyleSpecification } from 'mapbox-gl';
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
import { MapLegType, PositionType } from './types';
import { useMapFareZones } from './use-map-fare-zones';
import { useMapboxJsonStyle } from './use-mapbox-json-style';
import { useNationalStopRegistryLayers } from './national-stop-registry';
import { useDarkMode } from '@atb/modules/theme';
import useMediaQuery from '@atb/utils/user-media-query';
import { logSpecificEvent } from '@atb/modules/firebase';
import MapLoading from './map-loading';

export type MapProps = {
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
} & (
  | { position?: PositionType; initialZoom?: number }
  | { mapLegs: MapLegType[] }
  | {}
);

export default function Map(props: MapProps) {
  // Style depends on an async Firestore fetch. Wait until it's ready so that
  // the inner component can initialize the map synchronously — otherwise the
  // layer-installing hooks (fare zones, legs, NSR) would run once with
  // mapRef.current undefined and never re-run.
  const mapboxJsonStyle = useMapboxJsonStyle();
  const [isDarkMode] = useDarkMode();
  if (!mapboxJsonStyle) return <MapLoading />;
  return (
    <MapWithStyle
      key={isDarkMode ? 'dark' : 'light'} // For remounting on theme toogle
      mapboxJsonStyle={mapboxJsonStyle}
      {...props}
    />
  );
}

function MapWithStyle({
  mapboxJsonStyle,
  layer,
  onSelectStopPlace,
  ...props
}: MapProps & { mapboxJsonStyle: StyleSpecification }) {
  const mapWrapper = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | undefined>(undefined);
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
    logSpecificEvent('initialize_map');
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: mapboxData.accessToken,
      style: mapboxJsonStyle,
      center: position,
      zoom: initialZoom,
      bounds, // If bounds is specified, it overrides center and zoom constructor options.
    });
  }, [position, initialZoom, bounds, mapboxJsonStyle]);

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
  useMapFareZones(map);
  useNationalStopRegistryLayers(map);

  useEffect(() => {
    if (!isMobileDevice) {
      initializeMap();
    }
  }, [isMobileDevice, initializeMap]);

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
          restoreFocus={isFullscreen}
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
            aria-hidden="true"
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
