import style from './input.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import ErrorMessage from './error-message';
import DescriptionModal from './description-modal';
import { MonoIcon } from '@atb/components/icon';

type InputProps = {
  label: TranslatedString;
  description?: string;
  errorMessage?: TranslatedString;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export const Input = ({
  label,
  errorMessage,
  type,
  name,
  checked,
  value,
  description,
  onChange,
}: InputProps) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className={andIf({
        [style.container]: true,
        [style.rowDisplay]: type === 'checkbox' || type === 'submit',
      })}
    >
      <div className={style.label_container}>
        <label>
          <Typo.span textType="body__primary">{t(label)}</Typo.span>
        </label>

        {description && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={style.iconButton}
          >
            <MonoIcon icon={'status/Info'} />
          </button>
        )}
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
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}

      {showModal && description && (
        <DescriptionModal
          label={t(label)}
          description={description}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Input;
