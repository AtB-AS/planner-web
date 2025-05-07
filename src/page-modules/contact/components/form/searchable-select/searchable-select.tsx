import { useEffect, useState } from 'react';
import { MonoIcon } from '@atb/components/icon';
import style from '../form.module.css';
import { andIf } from '@atb/utils/css';
import {
  Key,
  Button,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  Group,
} from 'react-aria-components';
import { ErrorMessage } from '@atb/components/error-message';
import Label from '../form-component-label';

export type Option<T> = { id: string; name: string; value: T };
export type SearchableSelectProps<T> = {
  id: string;
  label: string;
  value?: T;
  placeholder: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  options: Option<T>[];
  error?: string;
  onChange: (value?: T) => void;
};

export default function SearchableSelect<T>({
  id,
  label,
  value,
  placeholder,
  isDisabled,
  isRequired,
  options,
  error,
  onChange,
}: SearchableSelectProps<T>) {
  const showError = !!error;
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value === undefined && !focused && inputValue !== '') {
      setInputValue('');
    }
  }, [value, focused, inputValue]);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const filteredOptions = options.filter((item) =>
    item.name
      .toLowerCase()
      .replace(/\s+/g, '') // Remove all white spaces from item name
      .includes(
        inputValue.toLowerCase().replace(/\s+/g, ''), // Remove all white spaces from input value
      ),
  );

  const getOptionBySelector = (key: string) =>
    options.find((option) => option.id.toLowerCase() === key.toLowerCase());

  const getOptionBySearch = (input: string) => {
    return options.find(
      (option) => option.name.toLowerCase() === input.toLowerCase(),
    );
  };

  const handleSelectionChange = (key: Key | null) => {
    if (key === null) return;
    const keyString = key.toString();
    const option = getOptionBySelector(keyString);
    setInputValue(option?.name || keyString);
    onChange(option?.value);
  };

  const handleInputChange = (inputValue: string) => {
    const option = getOptionBySearch(inputValue);
    setInputValue(option?.name || inputValue);
    onChange(option?.value);
  };

  return (
    <ComboBox
      items={filteredOptions as Iterable<object>}
      isDisabled={isDisabled}
      onSelectionChange={handleSelectionChange}
      className={style.searchable_select__comboBox}
      aria-label={label}
      aria-labelledby={`label-${id}`}
    >
      <Label
        label={label}
        htmlFor={`searchable-select-${id}`}
        disabled={isDisabled}
        isRequired={isRequired}
      />

      <Group className={style.searchable_select__group}>
        <Input
          id={`searchable_select__${id}`}
          placeholder={placeholder}
          className={andIf({
            [style.searchable_select__input]: true,
            [style.searchable_select__input_disabled]: !!isDisabled,
          })}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Button className={style.searchable_select__button}>
          <MonoIcon icon={'navigation/ExpandMore'} />
        </Button>
      </Group>
      <Popover className={style.searchable_select__popover}>
        <ListBox className={style.searchable_select__listBox}>
          <ListBoxItem
            textValue={placeholder}
            isDisabled
            className={style.searchable_select__listBoxItem}
          >
            <div className={style.searchable_select__item}>
              <span className={style.searchable_select__truncate}>
                {placeholder}
              </span>
              <span>{!value && <MonoIcon icon={'actions/Confirm'} />}</span>
            </div>
          </ListBoxItem>
          {filteredOptions.map((item) => (
            <ListBoxItem
              id={item.id}
              key={item.id}
              textValue={item.name}
              className={style.searchable_select__listBoxItem}
            >
              {({ isSelected, isFocused }) => (
                <div
                  className={`${style.searchable_select__item} ${
                    isFocused ? style.searchable_select__highlight : ''
                  } ${isSelected && value ? style.searchable_select__selected : ''}`}
                >
                  <span className={style.searchable_select__truncate}>
                    {item.name}
                  </span>
                  <span>
                    {value && isSelected && (
                      <MonoIcon icon={'actions/Confirm'} />
                    )}
                  </span>
                </div>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
      {showError && <ErrorMessage message={error} />}
    </ComboBox>
  );
}
