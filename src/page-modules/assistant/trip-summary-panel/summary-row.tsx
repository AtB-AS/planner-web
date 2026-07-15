import { ReactNode } from 'react';
import { Typo } from '@atb/components/typography';
import ScreenReaderOnly from '@atb/components/screen-reader-only';
import style from './trip-summary-panel.module.css';

type SummaryRowProps = {
  icon: ReactNode;
  value: string;
  label?: string;
};

export function SummaryRow({ icon, value, label }: SummaryRowProps) {
  return (
    <div className={style.summaryRow}>
      <span className={style.summaryRow__icon} aria-hidden="true">
        {icon}
      </span>
      <div className={style.summaryRow__text} aria-hidden="true">
        <Typo.span textType="body__m__strong">{value}</Typo.span>
        {label && (
          <Typo.span textType="body__s" className={style.summaryRow__label}>
            {label}
          </Typo.span>
        )}
      </div>
      <ScreenReaderOnly text={label ? `${value} ${label}` : value} />
    </div>
  );
}
