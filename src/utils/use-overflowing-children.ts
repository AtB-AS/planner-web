import { RefObject, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';

type OverflowState = {
  visibleCount: number;
  overflowIndices: number[];
  ready: boolean;
};

type UseOverflowingChildrenOptions = {
  reservePx: number;
  depKey: string;
  childSelector?: string;
};

type UseOverflowingChildrenResult = OverflowState & {
  rootRef: RefObject<HTMLDivElement | null>;
};

const DEFAULT_CHILD_SELECTOR = '[data-leg-index]';
const FULLY_VISIBLE_RATIO = 0.999;

function sameIndices(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function useOverflowingChildren({
  reservePx,
  depKey,
  childSelector = DEFAULT_CHILD_SELECTOR,
}: UseOverflowingChildrenOptions): UseOverflowingChildrenResult {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<OverflowState>({
    visibleCount: Number.POSITIVE_INFINITY,
    overflowIndices: [],
    ready: false,
  });

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const children = Array.from(
      root.querySelectorAll<HTMLElement>(childSelector),
    );
    const total = children.length;

    if (total === 0) {
      setState({ visibleCount: 0, overflowIndices: [], ready: true });
      return;
    }

    const indexByElement = new Map<Element, number>();
    children.forEach((element, index) => indexByElement.set(element, index));

    const hiddenFlags = new Array<boolean>(total).fill(false);

    const commit = () => {
      let visibleCount = total;
      for (let index = 0; index < total; index++) {
        if (hiddenFlags[index]) {
          visibleCount = index;
          break;
        }
      }
      const overflowIndices: number[] = [];
      for (let index = visibleCount; index < total; index++) {
        overflowIndices.push(index);
      }
      setState((previous) =>
        previous.ready &&
        previous.visibleCount === visibleCount &&
        sameIndices(previous.overflowIndices, overflowIndices)
          ? previous
          : { visibleCount, overflowIndices, ready: true },
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = indexByElement.get(entry.target);
          if (index === undefined) continue;
          hiddenFlags[index] =
            entry.boundingClientRect.width > 0 &&
            entry.intersectionRatio < FULLY_VISIBLE_RATIO;
        }
        commit();
      },
      {
        root,
        rootMargin: `0px -${Math.max(0, Math.round(reservePx))}px 0px 0px`,
        threshold: [FULLY_VISIBLE_RATIO, 1],
      },
    );

    children.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [reservePx, childSelector, depKey]);

  return { rootRef, ...state };
}
