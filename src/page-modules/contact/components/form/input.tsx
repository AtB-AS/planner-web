import style from './form.module.css';
import { ChangeEvent, useState } from 'react';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import { MonoIcon } from '@atb/components/icon';
import { Button } from '@atb/components/button';
import DescriptionModal from './description-modal';
import { ErrorMessage } from '@atb/components/error-message';

type InputProps = {
  label: string;
  modalContent?: {
    description?: string;
    instruction?: string;
    bulletPoints?: string[];
  };
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
  modalContent,
  disabled,
  onChange,
}: InputProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isModalContentProvided = hasModalContent(modalContent);
  const displayDescriptionModal = isModalOpen && isModalContentProvided;
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
          <Typo.span
            textType="body__primary"
            className={disabled ? style.label_disabled : ''}
          >
            {label}
          </Typo.span>
        </label>

        {isModalContentProvided && (
          <Button
            className={style.iconButton}
            onClick={toggleModalState}
            icon={{ right: <MonoIcon icon={'status/Info'} /> }}
            buttonProps={{
              'aria-label': t(
                PageText.Contact.components.modal.moreInformation(label),
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
        disabled={disabled}
        onChange={onChange}
      />
      {errorMessage && <ErrorMessage message={t(errorMessage)} />}

      {displayDescriptionModal && (
        <DescriptionModal
          title={label}
          modalContent={modalContent || {}}
          isModalOpen={isModalOpen}
          closeModal={toggleModalState}
        />
      )}
    </div>
  );
};

export default Input;

function hasModalContent(content?: {
  description?: string;
  instruction?: string;
  bulletPoints?: string[];
}): boolean {
  return !!(
    content &&
    (content.description ||
      content.instruction ||
      (content.bulletPoints && content.bulletPoints?.length > 0))
  );
}
