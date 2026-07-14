import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl, { type StyleSpecification } from 'mapbox-gl';
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
import { useMapboxJsonStyle } from './use-mapbox-json-style';
import { useNationalStopRegistryLayers } from './national-stop-registry';
import { useDarkMode } from '@atb/modules/theme';
import useMediaQuery from '@atb/utils/user-media-query';
import { logSpecificEvent } from '@atb/modules/firebase';
import MapLoading from './map-loading';

export type MapProps = {
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
  interactive?: boolean;
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
      key={isDarkMode ? 'dark' : 'light'} // For remounting on theme toggle
      mapboxJsonStyle={mapboxJsonStyle}
      {...props}
    />
  );
}

function MapWithStyle({
  mapboxJsonStyle,
  layer,
  onSelectStopPlace,
  interactive = true,
  ...props
}: MapProps & { mapboxJsonStyle: StyleSpecification }) {
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
      style: mapboxJsonStyle,
      center: position,
      zoom: initialZoom,
      bounds,
      interactive,
    });
  }, [position, initialZoom, bounds, mapboxJsonStyle, interactive]);

  useEffect(() => {
    initializeMap();
    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapContainer.current || typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(() => map.current?.resize());
    resizeObserver.observe(mapContainer.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { centerMap } = useMapInteractions(map, onSelectStopPlace);
  useMapPin(map, position, layer);
  useMapLegs(map, mapLegs);
  useMapFareZones(map);
  useNationalStopRegistryLayers(map);

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
