import { vi } from 'vitest';

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

vi.mock('mapbox-gl/dist/mapbox-gl.js', () => {
  return {
    default: {
      Map: class Map {
        setCenter() {}
        remove() {}
      },
    },
  };
});
