import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, useState } from 'react';
import style from './line-filter.module.css';
type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const [localFilterState, setLocalFilterState] = useState(filterState ?? []);

  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    const lineFilter = event.target.value;
    setLocalFilterState(lineFilter?.split(',') ?? []);
    onChange(lineFilter?.split(',') ?? null);
  };

  return (
    <div className={style.container}>
      <Typo.h3 textType="body__primary--bold" className={style.heading}>
        {t(PageText.Assistant.search.lineFilter.label)}
      </Typo.h3>
      <input
        className={style.input}
        type="text"
        placeholder={t(PageText.Assistant.search.lineFilter.placeholder)}
        value={localFilterState}
        onChange={onChangeWrapper}
      />

      <Typo.p textType="body__tertiary" className={style.infoText}>
        {t(PageText.Assistant.search.lineFilter.example)}
      </Typo.p>
    </div>
  );
}
