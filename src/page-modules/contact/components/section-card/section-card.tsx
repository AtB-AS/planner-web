import style from './section-card.module.css';
import { PropsWithChildren } from 'react';
import { Typo } from '@atb/components/typography';

export type SectionCardProps = PropsWithChildren<{
  title: string;
}>;

export const SectionCard = ({ title, children }: SectionCardProps) => {
  return (
    <section className={style.container}>
      <Typo.h3 textType="heading__m">{title}</Typo.h3>
      {children}
    </section>
  );
};

export default SectionCard;
