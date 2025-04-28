import style from './fieldset.module.css';
import { PropsWithChildren } from 'react';
import { Typo } from '@atb/components/typography';

export type FieldsetProps = PropsWithChildren<{
  title: string;
}>;

export const Fieldset = ({ title, children }: FieldsetProps) => {
  return (
    <fieldset className={style.fieldset}>
      <legend className={style.legend}>
        <Typo.h3 textType="heading__component">{title}</Typo.h3>
      </legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
