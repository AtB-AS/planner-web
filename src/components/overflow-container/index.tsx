import { Children, isValidElement, type ReactNode } from 'react';
import { and } from '@atb/utils/css';
import { useOverflowingChildren } from './use-overflowing-children';
import style from './overflow-container.module.css';

export type OverflowContainerProps = {
  children: ReactNode[];
  /**
   * Renders the overflow indicator (e.g. a "+N" pill). Called with the number
   * of hidden children (always >= 1) when overflowing, and with
   * children.length inside a hidden probe to reserve worst-case width.
   */
  overflow: (hiddenCount: number) => ReactNode;
  /**
   * Applied to the root container. Use it for layout (e.g. flex: 1) and to
   * set the item gap via `--overflow-container-gap` (default 0).
   */
  className?: string;
};

export function OverflowContainer({
  children,
  overflow,
  className,
}: OverflowContainerProps) {
  const items = Children.toArray(children);
  const keys = items.map((child, i) =>
    isValidElement(child) && child.key != null ? child.key : `__idx_${i}`,
  );

  const {
    rootRef,
    overflowProbeRef,
    visibleCount,
    overflowIndicatorPositionLeft,
  } = useOverflowingChildren(keys.join('|'));

  const hasOverflow = visibleCount < items.length;
  const hiddenCount = hasOverflow ? items.length - visibleCount : 0;

  return (
    <div className={and(style.container, className)}>
      <div className={style.row} ref={rootRef}>
        {items.map((child, i) => (
          <div
            key={keys[i]}
            className={style.item}
            data-overflowing={
              hasOverflow && i >= visibleCount ? 'true' : undefined
            }
          >
            {child}
          </div>
        ))}
      </div>
      {hasOverflow && (
        <div
          className={style.indicator}
          style={{ left: overflowIndicatorPositionLeft }}
        >
          {overflow(hiddenCount)}
        </div>
      )}
      {items.length > 0 && (
        <div className={style.probe} aria-hidden="true" ref={overflowProbeRef}>
          {overflow(items.length)}
        </div>
      )}
    </div>
  );
}
