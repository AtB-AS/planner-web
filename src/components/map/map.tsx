import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { isFeaturePoint, isStopPlace } from './utils';
import { ColorIcon } from '@atb/assets/color-icon';
import Button from '../button/button';
import { MonoIcon } from '@atb/assets/mono-icon';

export type LngLatPosition = [number, number];
export type MapProps = {
  position?: LngLatPosition;
  layer?: string;
  onSelectStopPlace: (id: string) => void;
};

type Marker = HTMLElement &
  React.DetailedReactHTMLElement<
    {
      className: string;
    },
    HTMLElement
  >;

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

export function Map({
  position = defaultPosition,
  layer,
  onSelectStopPlace,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

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
    <div className={style.mapWithHeader}>
      <div ref={mapContainer} className={style.mapContainer}>
        <div className={style.map__buttons}>
          <Button
            size="small"
            icon={{ left: <MonoIcon src="actions/Filter.svg" /> }}
            onClick={() => alert('Not implemented yet')}
          />
          <Button
            size="small"
            icon={{ left: <MonoIcon src="places/City.svg" /> }}
            onClick={() => centerMap(position)}
          />
        </div>
      </div>
    </div>
  );
}

const defaultPosition: LngLatPosition = [
  mapboxData.defaultLng,
  mapboxData.defaultLat,
];

function useMapPin(
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  position: LngLatPosition,
  layer?: string,
) {
  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>();

  const createMapPin = useCallback(() => {
    const pinSvg = React.createElement(
      'span',
      { className: style.positionMarker },
      [<ColorIcon key="pin" src="Pin.svg" />],
    ) as Marker;

    return new mapboxgl.Marker(pinSvg);
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

  return { centerMap };
}