import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.stubEnv('NEXT_PUBLIC_PLANNER_ORG_ID', 'atb');
vi.stubEnv(
  'NEXT_PUBLIC_MAPBOX_API_TOKEN',
  'aa.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.ccccccccccccccccccccc',
);
vi.stubEnv(
  'NEXT_PUBLIC_MAPBOX_STOP_PLACES_STYLE_URL',
  'mapbox://styles/name/aaaaaaaaaaaaaaaaaaaaaaaaaa',
);
vi.stubEnv('NEXT_PUBLIC_MAPBOX_DEFAULT_LAT', '62.4722');
vi.stubEnv('NEXT_PUBLIC_MAPBOX_DEFAULT_LNG', '6.1495');

vi.stubEnv('NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY', 'aaaaaaaaaaaaaaaaaaaaaaa');
vi.stubEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'aaaaaaaaaaaaaaaaaaaaaaa');
vi.stubEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'aaaaaaaaaaaaaaaaaaaaaaa');
vi.stubEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'aaaaaaaaaaaaaaaaaaaaaaa');

vi.stubEnv('NEXT_PUBLIC_BFF_URL', 'https://test.api.mittatb.no/bff');

vi.mock('mapbox-gl/dist/mapbox-gl.js', () => {
  return {
    default: {
      // Mark mapbox as not supported in test env.
      supported: () => false,
      Map: class Map {
        setCenter() {}
        remove() {}
        on() {}
        flyTo() {}
        getLayer() {}
      },
    },
  };
});
