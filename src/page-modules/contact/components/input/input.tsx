import style from './input.module.css';
import { ChangeEvent } from 'react';
import { TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';

type InputProps = {
  label: TranslatedString;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export const Input = ({ label, type, name, checked, onChange }: InputProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.rowDisplay]: type === 'radio' || type === 'checkbox',
      })}
    >
      <label className={style.label}>{t(label)}</label>
      <input
        type={type}
        name={name}
        className={style.input}
        checked={checked}
        onChange={() => onChange}
      />
    </div>
  );
};

export default Input;
