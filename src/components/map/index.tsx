import dynamic from 'next/dynamic';
import MapLoading from './map-loading';

export { MapWithHeader } from './map-with-header';
export { MapHeader } from './map-header';

export * from './utils';
export * from './types';

export const Map = dynamic(() => import('./map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => <MapLoading />,
});
