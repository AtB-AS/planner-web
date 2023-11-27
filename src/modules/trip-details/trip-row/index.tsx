import { PropsWithChildren } from 'react';
import style from './trip-row.module.css';
import { and } from '@atb/utils/css';
import Link from 'next/link';

type TripRowProps = PropsWithChildren<{
  rowLabel?: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
  href?: string;
  isBetween?: boolean;
}>;
export default function TripRow({
  rowLabel,
  children,
  alignChildren = 'center',
  href,
  isBetween = false,
}: TripRowProps) {
  const rowContent = (
    <>
      <div className={style.leftColumn}>{rowLabel}</div>
      <div className={style.decorationPlaceholder} />
      <div className={style.rightColumn}>{children}</div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={and(style.container, isBetween && style.middleRow)}
        style={{ alignItems: alignChildren }}
      >
        {rowContent}
      </Link>
    );
  }

  return (
    <div
      className={and(style.container, isBetween && style.middleRow)}
      style={{ alignItems: alignChildren }}
    >
      {rowContent}
    </div>
  );
}
