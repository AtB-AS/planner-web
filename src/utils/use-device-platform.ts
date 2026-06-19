import { useEffect, useState } from 'react';

export type DevicePlatform = 'android' | 'ios' | 'desktop';

export function useDevicePlatform(): DevicePlatform {
  const [platform, setPlatform] = useState<DevicePlatform>('desktop');

  useEffect(() => {
    setPlatform(getDevicePlatform());
  }, []);

  return platform;
}

function getDevicePlatform(): DevicePlatform {
  if (typeof navigator === 'undefined') return 'desktop';

  const ua = navigator.userAgent;

  if (
    /iPhone|iPad/.test(ua) ||
    (/Macintosh/.test(ua) && 'ontouchend' in document)
  ) {
    return 'ios';
  }

  if (/Android/.test(ua)) return 'android';

  return 'desktop';
}
