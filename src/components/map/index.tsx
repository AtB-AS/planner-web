import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [position, setPosition] = useState<Position>(initialPosition);

  useEffect(() => {
    if (!mapContainer.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
      style: process.env.NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL,
      center: [position.lng, position.lat],
      zoom: 13,
    });

    return () => map.current?.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initialPosition) return;
    setPosition(initialPosition);
  }, [initialPosition]);

  useEffect(() => {
    if (map.current) {
      map.current.setCenter([position.lng, position.lat]);
    }
  }, [position.lat, position.lng]);

  return <div ref={mapContainer} className={style.mapContainer} />;
}

const defaultPosition: Position = {
  lng: Number(process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LNG),
  lat: Number(process.env.NEXT_PUBLIC_MAPBOX_DEFAULT_LAT),
};
