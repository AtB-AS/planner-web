import { useEffect, useState } from 'react';
import { MonoIcon } from '@atb/components/icon';
import ErrorMessage from '../error-message';
import { andIf } from '@atb/utils/css';
import style from '../form.module.css';
import {
  Key,
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Group,
} from 'react-aria-components';

export type Option<T> = { id: string; name: string; value: T };
export type SearchableSelectProps<T> = {
  label: string;
  value?: T;
  placeholder: string;
  isDisabled?: boolean;
  options: Option<T>[];
  error?: string;
  onChange: (value?: T) => void;
};

export default function SearchableSelect<T>({
  label,
  value,
  placeholder,
  isDisabled,
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
    >
      <Label>{label}</Label>
      <Group
        className={andIf({
          [style.searchable_select__group]: true,
          [style.searchable_select__disabled]: !!isDisabled,
        })}
      >
        <Input
          placeholder={placeholder}
          className={style.searchable_select__input}
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
              <span className={style.searchable_select__checkmark}>
                {!value ? <MonoIcon icon={'actions/Confirm'} /> : '\u00A0'}
              </span>
              <span className={style.searchable_select__truncate}>
                {placeholder}
              </span>
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
                  } ${isSelected ? style.searchable_select__selected : ''}`}
                >
                  <span className={style.searchable_select__checkmark}>
                    {value && isSelected ? (
                      <MonoIcon icon={'actions/Confirm'} />
                    ) : (
                      '\u00A0'
                    )}
                  </span>
                  <span className={style.searchable_select__truncate}>
                    {item.name}
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
