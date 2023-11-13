import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { isFeaturePoint, isStopPlace } from './utils';
import Button from '../button/button';
import { MonoIcon } from '@atb/components/icon';
import { ComponentText, useTranslation } from '@atb/translations';
import { FocusScope } from '@react-aria/focus';
import { MapLegType } from '@atb/page-modules/departures/server/journey-planner/validators';
import { useTheme } from '@atb/modules/theme';
import { Theme } from '@atb-as/theme';
import hexToRgba from 'hex-to-rgba';
import { modeToColor } from '@atb/modules/transport-mode';

export type LngLatPosition = [lng: number, lat: number];
export type MapProps = {
  position?: LngLatPosition;
  layer?: string;
  onSelectStopPlace?: (id: string) => void;
  mapLegs?: MapLegType[];
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
const ZOOM_LEVEL = 16.5;

export function Map({
  position = defaultPosition,
  layer,
  onSelectStopPlace,
  mapLegs,
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
      zoom: ZOOM_LEVEL,
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
        zoom: ZOOM_LEVEL,
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
          <div ref={mapContainer} className={style.mapContainer} />
        </FocusScope>
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
    const pin: HTMLImageElement = document.createElement('img');
    pin.src = '/assets/mono/map/Pin.svg';
    return new mapboxgl.Marker(pin);
  }, []);

  const setMapPinPosition = useCallback(
    (position: LngLatPosition) => {
      if (!mapRef || !mapRef.current) return;
      const map = mapRef.current;
      if (!marker) {
        const newMarker = createMapPin();
        setMarker(newMarker);
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
  onSelectStopPlace?: (id: string) => void,
) {
  useEffect(() => {
    if (!mapRef || !onSelectStopPlace) return;
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
    mapRef.current.flyTo({ center: position, zoom: ZOOM_LEVEL, speed: 2 });
  };

  return { centerMap };
}

const useFullscreenMap = (
  mapWrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const openFullscreen = () => {
    if (!mapWrapperRef.current || !mapRef.current) return;
    mapWrapperRef.current.style.display = 'block';
    mapRef.current.resize();
    setIsFullscreen(true);
  };

  const closeFullscreen = useCallback(() => {
    if (!mapWrapperRef.current || !mapRef.current) return;
    mapWrapperRef.current.style.display = '';
    mapRef.current.resize();
    setIsFullscreen(false);
  }, [mapWrapperRef, mapRef]);

  const handlEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreen();
      }
    },
    [closeFullscreen],
  );

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handlEscapeKey);
    } else {
      document.removeEventListener('keydown', handlEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handlEscapeKey);
    };
  }, [isFullscreen, handlEscapeKey]);

  return { openFullscreen, closeFullscreen, isFullscreen };
};

const useMapLegs = (
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  transport: Theme['transport'],
  mapLegs?: MapLegType[],
) => {
  const addSource = useCallback(
    (map: mapboxgl.Map, mapLeg: MapLegType, id: number) => {
      const transportColor = modeToColor(
        {
          mode: mapLeg.faded ? 'unknown' : mapLeg.transportMode,
          subMode: mapLeg.transportSubmode,
        },
        transport,
      );
      const lineColor = mapLeg.faded
        ? hexToRgba(transportColor.background, 0.5)
        : transportColor.background;
      map.addSource(`route-${id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: mapLeg.points.map((pair) => [...pair].reverse()),
          },
        },
      });
      map.addSource(`route-${id}-start-end`, {
        type: 'geojson',
        data: {
          type: 'GeometryCollection',
          geometries: [
            {
              type: 'Point',
              coordinates: [mapLeg.points[0][1], mapLeg.points[0][0]],
            },
            {
              type: 'Point',
              coordinates: [
                mapLeg.points[mapLeg.points.length - 1][1],
                mapLeg.points[mapLeg.points.length - 1][0],
              ],
            },
          ],
        },
      });
      map.addLayer({
        id: `route-layer-${id}`,
        type: 'line',
        source: `route-${id}`,
        paint: {
          'line-color': lineColor,
          'line-width': 4,
          'line-offset': -1,
        },
      });
      map.addLayer({
        id: `route-layer-${id}-start-end`,
        type: 'circle',
        source: `route-${id}-start-end`,
        paint: {
          'circle-radius': 7.5,
          'circle-color': lineColor,
        },
      });
    },
    [transport],
  );

  useEffect(() => {
    if (!mapRef || !mapRef.current || !mapLegs) return;
    const map = mapRef.current;

    map.on('load', () => {
      mapLegs.forEach((mapLeg, index) => {
        addSource(map, mapLeg, index);
      });
    });
  }, [mapRef, mapLegs, addSource]);
};
