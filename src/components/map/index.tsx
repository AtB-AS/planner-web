import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapboxData } from '@atb/modules/org-data';

export type Position = {
  lat: number;
  lng: number;
};

export type MapProps = {
  initialPosition?: Position;
};

export function Map({ initialPosition = defaultPosition }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map>();

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: mapboxData.accessToken,
      style: mapboxData.style,
      center: [initialPosition.lng, initialPosition.lat],
      zoom: 13,
    });

    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([initialPosition.lng, initialPosition.lat]);
    }
  }, [initialPosition.lng, initialPosition.lat]);

  return <div ref={mapContainer} className={style.mapContainer} />;
}

const defaultPosition: Position = {
  lat: mapboxData.defaultLat,
  lng: mapboxData.defaultLng,
};
