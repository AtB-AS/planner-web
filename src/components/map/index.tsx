import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';
import { isFeaturePoint, isStopPlace } from './utils';

export type Position = {
  lat: number;
  lng: number;
};

export type LngLatPosition = [number, number];

export type MapProps = {
  position?: LngLatPosition;
  onSelectStopPlace: (id: string) => void;
};

const INTERACTIVE_LAYERS = [
  'boat.nr.api',
  'bus.nsr.api',
  'ferjekai.nsr.api',
  'airport.nsr.api',
  'bussterminal.nsr.api',
  'railway.nsr.api',
  'bus.tram.nsr.api',
];

export function Map({
  position = defaultPosition,
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

  useMapInteractions(map, onSelectStopPlace);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(position);
    }
  }, [position]);

  return <div ref={mapContainer} className={style.mapContainer} />;
}

const defaultPosition: LngLatPosition = [
  mapboxData.defaultLng,
  mapboxData.defaultLat,
];

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

  return {};
}
