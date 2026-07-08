import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type OverflowState = {
  visibleCount: number;

  // To determine how many elements fit before overflow, we need to lay out all
  // elements and measure (with some hidden if they don't fit).
  // But that means that if we need an overflow indicator, another element
  // already has its position in the flex flow
  //
  // Therefore, we absolutely position the overflow indicator at this position:
  overflowIndicatorPositionLeft: number;
};

export function useOverflowingChildren(depKey: string) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const overflowIndicatorProbeRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<OverflowState>({
    visibleCount: Number.POSITIVE_INFINITY,
    overflowIndicatorPositionLeft: 0,
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const overflowIndicatorProbe = overflowIndicatorProbeRef.current;
    if (
      !root ||
      !overflowIndicatorProbe ||
      typeof ResizeObserver === 'undefined'
    )
      return;

    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      if (rootRect.width === 0) return;
      const rects = Array.from(root.children, (child) =>
        child.getBoundingClientRect(),
      );
      const lastRect = rects[rects.length - 1];
      let visibleCount = rects.length;
      let overflowIndicatorPositionLeft = 0;
      if (lastRect && lastRect.right > rootRect.right) {
        const gap = parseFloat(getComputedStyle(root).columnGap) || 0;
        const limit = rootRect.right - overflowIndicatorProbe.offsetWidth - gap;
        visibleCount = 0;
        for (const rect of rects) {
          if (rect.right > limit) break;
          visibleCount++;
          overflowIndicatorPositionLeft = rect.right - rootRect.left + gap;
        }
      }
      setState((previous) =>
        previous.visibleCount === visibleCount &&
        previous.overflowIndicatorPositionLeft === overflowIndicatorPositionLeft
          ? previous
          : { visibleCount, overflowIndicatorPositionLeft },
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(overflowIndicatorProbe);
    Array.from(root.children).forEach((child) => observer.observe(child));
    measure();

    return () => observer.disconnect();
  }, [depKey]);

  return { rootRef, overflowIndicatorProbeRef, ...state };
}
