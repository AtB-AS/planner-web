import { type ReactNode } from 'react';
import { Typo } from '@atb/components/typography';
import { and } from '@atb/utils/css';
import style from './counter-box.module.css';

export type CounterBoxProps = {
  count: number;
  notification?: ReactNode;
  className?: string;
};

export function CounterBox({
  count,
  notification,
  className,
}: CounterBoxProps) {
  if (count < 1) return null;
  return (
    <>
      <div className={and(style.counterBox, className)}>
        <Typo.span textType="body__m__strong">+{count}</Typo.span>
      </div>
      {notification}
    </>
  );
}
