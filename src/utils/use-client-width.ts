import { useEffect, useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';

export function useClientWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) setWidth(ref.current.clientWidth);
  }, [ref]);

  useResizeObserver(ref, (entry) => setWidth(entry.target.clientWidth));

  return [width, ref] as const;
}
