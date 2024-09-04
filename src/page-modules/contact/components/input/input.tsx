import style from './input.module.css';
import { ChangeEvent } from 'react';
import { TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';

type InputProps = {
  label: TranslatedString;
  validationMessage?: TranslatedString;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export const Input = ({
  label,
  validationMessage,
  type,
  name,
  checked,
  value,
  onChange,
}: InputProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.rowDisplay]:
          type === 'radio' || type === 'checkbox' || type === 'submit',
      })}
    >
      <div>
        <label>{t(label)}</label>
        {validationMessage && (
          <>
            {' - '}
            <label className={style.error}>{t(validationMessage)}</label>
          </>
        )}
      </div>
      <input
        type={type}
        name={name}
        className={andIf({
          [style.input]: true,
          [style.input_error]: validationMessage ? true : false,
        })}
        checked={checked}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
