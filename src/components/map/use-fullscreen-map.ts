import { useCallback, useEffect, useState } from 'react';

export const useFullscreenMap = (
  mapWrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  mapRef: React.MutableRefObject<mapboxgl.Map | undefined>,
  initializeMap: () => void,
) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const openFullscreen = () => {
    initializeMap();
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

  const handleEscapeKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeFullscreen();
      }
    },
    [closeFullscreen],
  );

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isFullscreen, handleEscapeKey]);

  return { openFullscreen, closeFullscreen, isFullscreen };
};
