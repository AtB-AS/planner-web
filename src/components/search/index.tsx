import Downshift from 'downshift';
import { useState } from 'react';
import { useAutocomplete } from '@atb/page-modules/departures/client';
import style from './search.module.css';
import { split } from 'lodash';
import { MonoIcon } from '@atb/assets/mono-icon';
import VenueIcon from '@atb/components/venue-icon';
import { andIf } from '@atb/utils/css';

type SearchProps = {
  label: string;
  onChange: (selection: any) => void;
};

export default function Search({ label, onChange }: SearchProps) {
  const [query, setQuery] = useState('');
  const { data } = useAutocomplete(query);

  const highlight = (name: string, inputValue: string | null) => {
    if (!inputValue) return [name];

    return split(name, new RegExp(`(${inputValue})`, 'gi'));
  };

  return (
    <Downshift
      initialInputValue={query}
      onInputValueChange={(inputValue) => setQuery(inputValue || '')}
      onChange={onChange}
      itemToString={(item) => (item ? item.name : '')}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        getRootProps,
      }) => (
        <div className={style.container}>
          <label className={style.label} {...getLabelProps()}>
            {label}
          </label>

          <div
            className={style.inputContainer}
            {...getRootProps({}, { suppressRefError: true })}
          >
            <input className={style.input} {...getInputProps()} />
          </div>

          <button
            className={style.myPositionButton}
            onClick={() => {
              alert('Get my position');
            }}
          >
            <MonoIcon src="places/City.svg" />
          </button>

          <ul className={style.menu} {...getMenuProps()}>
            {isOpen && data
              ? data.map((item, index) => (
                  <li
                    className={andIf({
                      [style.item]: true,
                      [style.itemHighlighted]: highlightedIndex === index,
                    })}
                    {...getItemProps({
                      index,
                      item,
                    })}
                    key={item.name + index}
                  >
                    <div className={style.itemIcon} aria-hidden>
                      <VenueIcon category={item.category} />
                    </div>
                    <span className={style.itemName}>
                      {highlight(item.name, inputValue).map((part, index) => {
                        if (!part.length || !inputValue) return;
                        return part.toLowerCase() ===
                          inputValue.toLowerCase() ? (
                          <strong key={index}>{part}</strong>
                        ) : (
                          <span key={index}>{part}</span>
                        );
                      })}
                    </span>
                    <span className={style.itemLocality}>{item.locality}</span>
                  </li>
                ))
              : null}
          </ul>
        </div>
      )}
    </Downshift>
  );
}
