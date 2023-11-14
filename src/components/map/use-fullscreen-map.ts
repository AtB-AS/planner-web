import { useCallback, useEffect, useState } from 'react';

export const useFullscreenMap = (
  mapWrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const openFullscreen = () => {
    if (!mapWrapperRef.current || !mapRef.current) return;
    mapWrapperRef.current.style.display = 'block';
    mapRef.current.resize();
    setIsFullscreen(true);
  };

  const closeFullscreen = useCallback(() => {
    if (!mapWrapperRef.current || !mapRef.current) return;
    mapWrapperRef.current.style.display = '';
    mapRef.current.resize();
    setIsFullscreen(false);
  }, [mapWrapperRef, mapRef]);

  const handlEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreen();
      }
    },
    [closeFullscreen],
  );

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handlEscapeKey);
    } else {
      document.removeEventListener('keydown', handlEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handlEscapeKey);
    };
  }, [isFullscreen, handlEscapeKey]);

  return { openFullscreen, closeFullscreen, isFullscreen };
};
