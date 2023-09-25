import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Position } from 'geojson';

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
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
      style: process.env.NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL,
      center: [initialPosition[0], initialPosition[1]],
      zoom: 13,
    });

    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([initialPosition[0], initialPosition[1]]);
    }
  }, [initialPosition]);

  return <div ref={mapContainer} className={style.mapContainer} />;
}

const defaultPosition: Position = [
  Number(process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LNG),
  Number(process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LAT),
];
