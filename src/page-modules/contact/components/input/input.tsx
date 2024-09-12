import style from './input.module.css';
import { ChangeEvent, useState } from 'react';
import { TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';

type InputProps = {
  label: TranslatedString;
  description?: TranslatedString;
  errorMessage?: TranslatedString;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export const Input = ({
  label,
  description,
  errorMessage,
  type,
  name,
  checked,
  value,
  onChange,
}: InputProps) => {
  const { t } = useTranslation();
  const [isDescriptionOpen, setDescriptionOpen] = useState(false);

  const toggleInfoBox = () => {
    setDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.rowDisplay]:
          type === 'radio' || type === 'checkbox' || type === 'submit',
      })}
    >
      <div className={style.label_container}>
        <label>{t(label)}</label>
      </div>
      <input
        type={type}
        name={name}
        className={andIf({
          [style.input]: true,
          [style.input__error]: errorMessage ? true : false,
        })}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      {description && <p className={style.description}>{t(description)}</p>}

      {errorMessage && (
        <label
          className={andIf({
            [style.input_label__error]: true,
          })}
        >
          {t(errorMessage)}
        </label>
      )}
    </div>
  );
};

export default Input;
