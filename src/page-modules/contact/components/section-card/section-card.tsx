import { TranslatedString, useTranslation } from '@atb/translations';
import style from './section-card.module.css';
import { PropsWithChildren } from 'react';
import { Typo } from '@atb/components/typography';

export type SectionCardProps = PropsWithChildren<{
  title: TranslatedString;
}>;

export const SectionCard = ({ title, children }: SectionCardProps) => {
  const { t } = useTranslation();
  return (
    <section className={style.container}>
      <Typo.h3 textType="heading__component">{t(title)}</Typo.h3>
      {children}
    </section>
  );
};

export default SectionCard;
