import { useRef, useEffect } from 'react';

export default function useInterval(
  callback: Function,
  milliseconds: number,
  deps: React.DependencyList = [],
  disabled: boolean = false,
) {
  const savedCallback = useRef<Function>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (milliseconds !== null && !disabled) {
      let id = setInterval(tick, milliseconds);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [milliseconds, disabled, ...deps]);
}
