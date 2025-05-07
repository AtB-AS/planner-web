import style from './form.module.css';
import { ChangeEvent, useState } from 'react';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';
import { MonoIcon } from '@atb/components/icon';
import { Button } from '@atb/components/button';
import DescriptionModal from './description-modal';
import { ErrorMessage } from '@atb/components/error-message';
import FormComponentLabel from './form-component-label';

type InputProps = {
  id: string;
  label: string;
  modalContent?: {
    description?: string;
    instruction?: string;
    bulletPoints?: string[];
  };
  isRequired?: boolean;
  errorMessage?: TranslatedString;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
} & JSX.IntrinsicElements['input'];

export const Input = ({
  id,
  label,
  errorMessage,
  type,
  name,
  checked,
  value,
  modalContent,
  disabled,
  onChange,
  placeholder,
  isRequired,
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
        <FormComponentLabel
          label={label}
          htmlFor={`input-${name}`}
          disabled={disabled}
          isRequired={isRequired}
        />
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
        id={`input__${id}`}
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
        placeholder={placeholder}
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
