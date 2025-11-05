import style from './fieldset.module.css';
import { PropsWithChildren } from 'react';
import { Typo } from '@atb/components/typography';
import { andIf } from '@atb/utils/css';

export type FieldsetProps = PropsWithChildren<{
  title?: string;
  isRequired?: boolean;
}>;

export const Fieldset = ({
  title,
  isRequired = false,
  children,
}: FieldsetProps) => {
  return (
    <fieldset className={style.fieldset}>
      {title && (
        <legend className={style.legend}>
          <Typo.h3
            textType="heading__m"
            className={andIf({
              [style.required]: isRequired,
            })}
          >
            {title}
          </Typo.h3>
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default Fieldset;
