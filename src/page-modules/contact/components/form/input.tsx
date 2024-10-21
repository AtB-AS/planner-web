import style from './input.module.css';
import { ChangeEvent, useState } from 'react';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import ErrorMessage from './error-message';
import DescriptionModal from './description-modal';
import { MonoIcon } from '@atb/components/icon';
import { Button } from '@atb/components/button';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayDescriptionModal = description && isModalOpen; // Condition to avoid rendering of useEffect inside DescriptionModal before opened.

  const toggleModalState = () => {
    setIsModalOpen(!isModalOpen);
  };

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
          <Button
            className={style.iconButton}
            onClick={toggleModalState}
            icon={{ right: <MonoIcon icon={'status/Info'} /> }}
            buttonProps={{
              'aria-label': t(
                PageText.Contact.components.modal.moreInformation(t(label)),
              ),
            }}
          />
        )}
      </div>
      <input
        type={type}
        name={name}
        className={andIf({
          [style.input]: true,
          [style.input__error]: !!errorMessage,
        })}
        checked={checked}
        value={value}
        onChange={onChange}
      />
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}

      {displayDescriptionModal && (
        <DescriptionModal
          title={t(label)}
          description={description}
          isModalOpen={isModalOpen}
          closeModal={toggleModalState}
        />
      )}
    </div>
  );
};

export default Input;
