import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, useState } from 'react';
import style from './line-filter.module.css';
import { getOrgData } from '@atb/modules/org-data';
type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const { orgLineIdPrefix } = getOrgData();

  const [localFilterState, setLocalFilterState] = useState(
    filterState?.map((line) => line.replace(orgLineIdPrefix, '')).join(', ') ??
      '',
  );

  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    const lineFilter = event.target.value;
    setLocalFilterState(lineFilter);

    if (!lineFilter) {
      onChange(null);
    } else {
      const linesWithPrefix = lineFilter
        .split(',')
        .map((line) => `${orgLineIdPrefix}${line.trim()}`);

      onChange(linesWithPrefix);
    }
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