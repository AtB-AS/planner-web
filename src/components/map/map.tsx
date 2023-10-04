import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { isFeaturePoint, isStopPlace } from './utils';
import Button from '../button/button';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import { createRoot } from 'react-dom/client';

export type LngLatPosition = [lng: number, lat: number];
export type MapProps = {
  position?: LngLatPosition;
  layer?: string;
  onSelectStopPlace: (id: string) => void;
};

const INTERACTIVE_LAYERS = [
  'airport.nsr.api',
  'boat.nsr.api',
  'bus.nsr.api',
  'bus.tram.nsr.api',
  'bussterminal.nsr.api',
  'ferjekai.nsr.api',
  'metro.nsr.api',
  'metro.tram.nsr.api',
  'railway.nsr.api',
  'tram.nsr.api',
];

const defaultPosition: LngLatPosition = [
  mapboxData.defaultLng,
  mapboxData.defaultLat,
];

export function Map({
  position = defaultPosition,
  layer,
  onSelectStopPlace,
}: MapProps) {
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
      zoom: 13,
    });

    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { centerMap } = useMapInteractions(map, onSelectStopPlace);
  const { mapWrapperRef, toggleFullscreen } = useFullscreenMap(map);
  useMapPin(map, position, layer);

  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: position,
        zoom: 15,
        speed: 2,
      });
    }
  }, [position]);

  return (
    <div className={style.map}>
      <Button
        className={style.fullscreenButton}
        title={t(ComponentText.Map.map.openFullscreenButton)}
        icon={{ left: <MonoIcon icon="map/Map" /> }}
        onClick={toggleFullscreen}
      />

      <div className={style.mapWrapper} ref={mapWrapperRef}>
        <Button
          className={style.closeButton}
          onClick={toggleFullscreen}
          size="small"
          icon={{
            left: <MonoIcon icon="navigation/ArrowLeft" overrideMode="dark" />,
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
        <div ref={mapContainer} className={style.mapContainer} />
      </div>
    </div>
  );
}

function useMapPin(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  position: LngLatPosition,
  layer?: string,
) {
  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>();

  const createMapPin = useCallback(() => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<PinSvg />);
    return new mapboxgl.Marker(div);
  }, []);

  const setMapPinPosition = useCallback(
    (position: LngLatPosition) => {
      if (!mapRef || !mapRef.current) return;
      const map = mapRef.current;
      if (!marker) {
        const newMarker = createMapPin();
        setMarker(newMarker as mapboxgl.Marker);
      }

      if (marker) marker.setLngLat(position).addTo(map);
    },
    [createMapPin, mapRef, marker],
  );

  const removeMarkerFromMap = useCallback(() => {
    if (!marker) return;
    marker.remove();
  }, [marker]);

  useEffect(() => {
    if (layer === 'address') {
      setMapPinPosition(position);
    }
    if (layer !== 'address') removeMarkerFromMap();
  }, [layer, position, setMapPinPosition, removeMarkerFromMap]);
}

function useMapInteractions(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  onSelectStopPlace: (id: string) => void,
) {
  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.current;

    const handleMouseEnter = () => {
      if (map) map.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (map) map.getCanvas().style.cursor = '';
    };

    const handleStopPlaceClick = (
      e: mapboxgl.MapMouseEvent & mapboxgl.EventData,
    ) => {
      if (!map) return;

      const features = map.queryRenderedFeatures(e.point);
      if (
        features.length &&
        isFeaturePoint(features[0]) &&
        isStopPlace(features[0])
      ) {
        onSelectStopPlace(features[0].properties?.id);
      }
    };

    if (map) {
      map.on('load', () => {
        map.on('mouseenter', INTERACTIVE_LAYERS, handleMouseEnter);
        map.on('mouseleave', INTERACTIVE_LAYERS, handleMouseLeave);
        map.on('click', handleStopPlaceClick);
      });
    }
  }, [mapRef, onSelectStopPlace]);

  const centerMap = (position: LngLatPosition) => {
    if (!mapRef || !mapRef.current) return;
    mapRef.current.flyTo({ center: position, zoom: 15, speed: 2 });
  };

  const reziseMap = () => {
    if (!mapRef || !mapRef.current) return;
    mapRef.current.resize();
  };

  return { centerMap, reziseMap };
}

function useFullscreenMap(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (!mapWrapperRef.current) return;

    if (isFullscreen) {
      mapWrapperRef.current.style.display = 'block';
      mapRef.current?.resize();
    } else {
      mapWrapperRef.current.style.display = '';
      mapRef.current?.resize();
    }
  }, [isFullscreen, mapWrapperRef, mapRef]);

  return { mapWrapperRef, isFullscreen, toggleFullscreen };
}

function PinSvg() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.7689 37.5762C19.4924 38.1413 20.5076 38.1413 21.2311 37.5762C21.9546 37.0111 22.0623 36.9249 23.236 35.835C24.4096 34.7451 25.9768 33.1746 27.5487 31.2507C30.6363 27.472 34 22.0182 34 16C34 8.26801 27.732 2 20 2C12.268 2 6 8.26801 6 16C6 22.0182 9.36366 27.472 12.4513 31.2507C14.0232 33.1746 15.5904 34.7451 16.764 35.835C17.9377 36.9249 18.0454 37.0111 18.7689 37.5762Z"
        className={style.pinSvg__fill}
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.0957 37.9548C16.4813 38.3251 16.4933 38.3366 17.5378 39.1524C18.9848 40.2825 21.0153 40.2825 22.4622 39.1524C23.5067 38.3366 23.5187 38.3251 23.9043 37.9548C24.0529 37.8122 24.257 37.6162 24.5969 37.3005C25.8193 36.1654 27.4536 34.5281 29.0975 32.5162C32.2727 28.6302 36 22.7227 36 16C36 7.16344 28.8366 0 20 0C11.1634 0 4 7.16344 4 16C4 22.7227 7.72732 28.6302 10.9025 32.5162C12.5464 34.5281 14.1807 36.1654 15.4031 37.3005C15.743 37.6162 15.9471 37.8122 16.0957 37.9548ZM21.2311 37.5762C20.5076 38.1413 19.4924 38.1413 18.7689 37.5762C18.0454 37.0111 17.9377 36.9249 16.764 35.835C15.5904 34.7451 14.0232 33.1746 12.4513 31.2507C9.36366 27.472 6 22.0182 6 16C6 8.26801 12.268 2 20 2C27.732 2 34 8.26801 34 16C34 22.0182 30.6363 27.472 27.5487 31.2507C25.9768 33.1746 24.4096 34.7451 23.236 35.835C22.0623 36.9249 21.9546 37.0111 21.2311 37.5762Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16 16C16 13.7909 17.7909 12 20 12C22.2091 12 24 13.7909 24 16C24 18.2091 22.2091 20 20 20C17.7909 20 16 18.2091 16 16Z"
        fill="white"
      />
    </svg>
  );
}
