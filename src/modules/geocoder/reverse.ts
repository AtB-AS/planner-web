import { GeocoderFeature } from '@atb/page-modules/departures';
import qs from 'query-string';

export type ReverseApiReturnType = GeocoderFeature | undefined;

export async function reverse(coords: GeolocationCoordinates) {
  const query = {
    lat: coords.latitude,
    lon: coords.longitude,
  };
  const result = await fetch(`/api/bff/reverse?${qs.stringify(query)}`);

  return await result.json();
}
