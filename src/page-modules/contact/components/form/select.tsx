import { MonoIcon } from '@atb/components/icon';
import style from './form.module.css';
import {
  Button,
  Key,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
} from 'react-aria-components';
import { ErrorMessage } from '@atb/components/error-message';
import FormComponentLabel from './form-component-label';

export type SelectProps<T> = {
  id: string;
  label?: string;
  onChange: (value?: T) => void;
  error?: string;
  value?: T;
  options: T[];
  valueToId: (val: T) => string;
  valueToText: (val: T) => string;
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
};

export default function CustomSelect<T>({
  id,
  label,
  onChange,
  error,
  value,
  options,
  valueToId,
  valueToText,
  placeholder,
  disabled,
  isRequired,
}: SelectProps<T>) {
  const showError = !!error;

  const findItemFromOptions = (key: string) =>
    options.find(
      (option) => valueToId(option).toLowerCase() === key.toLowerCase(),
    );

  const onChangeInternal = (key: Key | null) => {
    if (key === null) return;
    onChange(findItemFromOptions(key.toString()));
  };

  return (
    <Select
      id={`select__${id}`}
      onSelectionChange={onChangeInternal}
      isDisabled={disabled}
      className={style.select__select_container}
      aria-label={label}
      aria-labelledby={`label-${id}`}
    >
      {label && (
        <FormComponentLabel
          label={label}
          htmlFor={`select-${id}`}
          disabled={disabled}
          isRequired={isRequired}
        />
      )}
      <Button className={style.select__button}>
        {value ? (
          <span>{valueToText(value)}</span>
        ) : (
          <span
            className={`${style.select__placeholder} ${disabled ? style.label_disabled : ''}`}
          >
            {placeholder}
          </span>
        )}
        <MonoIcon icon={'navigation/ExpandMore'} />
      </Button>
      <Popover className={style.select__popover}>
        <ListBox className={style.select__listBox}>
          <ListBoxItem
            isDisabled
            textValue={placeholder}
            className={style.select__listBoxItem}
          >
            <div className={style.select__item}>
              <span className={style.select__placholder}>{placeholder}</span>
              {!value && <MonoIcon icon={'actions/Confirm'} />}
            </div>
          </ListBoxItem>
          {options.map((option) => (
            <ListBoxItem
              id={`${valueToId(option)}`}
              key={`key-option-${valueToId(option)}`}
              textValue={valueToText(option)}
              className={style.select__listBoxItem}
            >
              {({ isSelected, isFocused }) => (
                <div
                  className={`${style.select__item} ${
                    isFocused ? style.select__highlight : ''
                  }`}
                >
                  <span>{valueToText(option)}</span>
                  <span>
                    {value && isSelected ? (
                      <MonoIcon icon={'actions/Confirm'} />
                    ) : (
                      '\u00A0'
                    )}
                  </span>
                </div>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
      {showError && <ErrorMessage message={error} />}
    </Select>
  );
}
