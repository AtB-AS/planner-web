import { TranslatedString, useTranslation } from '@atb/translations';
import style from './section-card.module.css';
import { PropsWithChildren } from 'react';

export type SectionCardProps = PropsWithChildren<{
  title: TranslatedString;
}>;

export const SectionCard = ({ title, children }: SectionCardProps) => {
  const { t } = useTranslation();
  return (
    <section className={style.container}>
      <h3>{t(title)}</h3>
      {children}
    </section>
  );
};

export default SectionCard;
