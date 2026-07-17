import { useEffect, useMemo, useRef, useState } from 'react';
import type { Map } from 'mapbox-gl';
import type { VehicleWithPosition } from '@atb/page-modules/departures/client/vehicles';
import { useDarkMode } from '@atb/modules/theme';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

const SOURCE_ID = 'live-vehicle';
const VEHICLE_LAYER_ID = 'live-vehicle-icon';
const ARROW_LAYER_ID = 'live-vehicle-arrow';
const ARROW_OFFSET_PX = 31;
const STALE_THRESHOLD_SEC = 30;

type Options = {
  vehicle?: VehicleWithPosition;
  isDisconnected: boolean;
  mode?: TransportMode;
  subMode?: TransportSubmode;
  onMarkerClick?: () => void;
};

export function useLiveVehicle(
  mapRef: React.RefObject<Map | undefined>,
  { vehicle, isDisconnected, mode, subMode, onMarkerClick }: Options,
) {
  const [isDarkMode] = useDarkMode();
  const themeSuffix = isDarkMode ? 'dark' : 'light';
  const spriteMode = useMemo(
    () => getVehicleSpriteMode(mode, subMode),
    [mode, subMode],
  );

  const isStale = useIsStale(vehicle?.lastUpdated);
  const { iconImage, arrowImage } = getIconNames({
    spriteMode,
    themeSuffix,
    isStale,
    isDisconnected,
  });

  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = () => onMarkerClickRef.current?.();
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    const setup = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
      }
      if (!map.getLayer(ARROW_LAYER_ID)) {
        map.addLayer({
          id: ARROW_LAYER_ID,
          type: 'symbol',
          source: SOURCE_ID,
          filter: ['==', ['get', 'showArrow'], true],
          layout: {
            'icon-image': ['get', 'arrowImage'],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-rotation-alignment': 'map',
            'icon-rotate': ['get', 'bearing'],
            'icon-offset': [0, -ARROW_OFFSET_PX],
          },
        });
      }
      if (!map.getLayer(VEHICLE_LAYER_ID)) {
        map.addLayer({
          id: VEHICLE_LAYER_ID,
          type: 'symbol',
          source: SOURCE_ID,
          layout: {
            'icon-image': ['get', 'iconImage'],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
          },
        });
      }
    };

    map.on('click', VEHICLE_LAYER_ID, handleClick);
    map.on('mouseenter', VEHICLE_LAYER_ID, handleMouseEnter);
    map.on('mouseleave', VEHICLE_LAYER_ID, handleMouseLeave);

    if (map.isStyleLoaded()) setup();
    else map.once('load', setup);

    return () => {
      map.off('load', setup);
      map.off('click', VEHICLE_LAYER_ID, handleClick);
      map.off('mouseenter', VEHICLE_LAYER_ID, handleMouseEnter);
      map.off('mouseleave', VEHICLE_LAYER_ID, handleMouseLeave);
    };
  }, [mapRef]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const update = () => {
      const source = map.getSource(SOURCE_ID);
      if (!source || source.type !== 'geojson') return;
      if (!vehicle?.location) {
        source.setData({ type: 'FeatureCollection', features: [] });
        return;
      }
      const showArrow = !isDisconnected && !isStale && vehicle.bearing != null;
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              iconImage,
              arrowImage,
              bearing: vehicle.bearing ?? 0,
              showArrow,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                vehicle.location.longitude,
                vehicle.location.latitude,
              ],
            },
          },
        ],
      });
    };

    if (map.isStyleLoaded()) update();
    else map.once('load', update);

    return () => {
      map.off('load', update);
    };
  }, [mapRef, vehicle, iconImage, arrowImage, isStale, isDisconnected]);
}

function useIsStale(lastUpdated: string | undefined): boolean {
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
    if (!lastUpdated) {
      setIsStale(false);
      return;
    }
    const check = () => {
      const ageSec = (Date.now() - new Date(lastUpdated).getTime()) / 1000;
      setIsStale(ageSec > STALE_THRESHOLD_SEC);
    };
    check();
    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  return isStale;
}

function getIconNames({
  spriteMode,
  themeSuffix,
  isStale,
  isDisconnected,
}: {
  spriteMode: string;
  themeSuffix: 'light' | 'dark';
  isStale: boolean;
  isDisconnected: boolean;
}) {
  const state = isDisconnected ? 'error' : isStale ? 'loading' : 'active';
  const iconImage =
    state === 'loading'
      ? `vehiclepin_loading_${themeSuffix}`
      : `vehiclepin_${spriteMode}_${state}_${themeSuffix}`;
  const arrowImage = `vehiclepin_${spriteMode}_indicator_${themeSuffix}`;
  return { iconImage, arrowImage };
}

const BOAT_SUBMODES = new Set<TransportSubmode>([
  TransportSubmode.HighSpeedPassengerService,
  TransportSubmode.HighSpeedVehicleService,
  TransportSubmode.NationalPassengerFerry,
  TransportSubmode.LocalPassengerFerry,
  TransportSubmode.SightseeingService,
]);

function getVehicleSpriteMode(
  mode?: TransportMode,
  subMode?: TransportSubmode,
): string {
  switch (mode) {
    case TransportMode.Bus:
    case TransportMode.Coach:
      if (subMode === TransportSubmode.AirportLinkBus) return 'otherbus';
      if (subMode === TransportSubmode.LocalBus) return 'bus';
      return 'regionalbus';
    case TransportMode.Tram:
      return 'tram';
    case TransportMode.Metro:
      return 'metro';
    case TransportMode.Rail:
      if (subMode === TransportSubmode.AirportLinkRail) return 'othertrain';
      return 'train';
    case TransportMode.Water:
      return subMode && BOAT_SUBMODES.has(subMode) ? 'boat' : 'ferry';
    default:
      return 'regionalbus';
  }
}
