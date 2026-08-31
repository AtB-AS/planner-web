import dynamic from 'next/dynamic';
import MapLoading from './map-loading';

// Mapbox GL can't run on the server, so the map must only be loaded on the
// client. Kept in its own module so both the package index and internal
// components (e.g. map-with-header) can use it without circular imports.
export const Map = dynamic(() => import('./map'), {
  ssr: false,
  loading: () => <MapLoading />,
});
