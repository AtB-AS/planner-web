import LabeledInput, { LabeledInputProps } from '@atb/components/labled-input';
import { Typo } from '@atb/components/typography';
import { getOrgData } from '@atb/modules/org-data';
import { PageText, useTranslation } from '@atb/translations';
import { ChangeEvent, useState } from 'react';
import style from './line-filter.module.css';
type LineFilterProps = {
  filterState: string[] | null;
  onChange: (lineFilter: string[] | null) => void;
};

export default function LineFilter({ filterState, onChange }: LineFilterProps) {
  const { t } = useTranslation();

  const { orgLineIdPrefix } = getOrgData();
  const [error, setError] = useState<LabeledInputProps['validationError']>();
  const [localFilterState, setLocalFilterState] = useState(
    filterState?.map((line) => line.replace(orgLineIdPrefix, '')).join(', ') ??
      '',
  );

  const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
    const lineFilter = event.target.value;
    setLocalFilterState(lineFilter);
    setError(undefined);

    if (!isValidFilter(lineFilter)) {
      setError(t(PageText.Assistant.search.lineFilter.error));
      return;
    }

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

      <LabeledInput
        label={t(PageText.Assistant.search.lineFilter.lineSearch.label)}
        placeholder={t(
          PageText.Assistant.search.lineFilter.lineSearch.placeholder,
        )}
        type="text"
        pattern="[0-9, ]*"
        value={localFilterState}
        onChange={onChangeWrapper}
        validationError={error}
      />

      <Typo.p textType="body__tertiary" className={style.infoText}>
        {t(PageText.Assistant.search.lineFilter.example)}
      </Typo.p>
    </div>
  );
}

function isValidFilter(filter: string): boolean {
  return filter.split(',').every((line) => {
    return !isNaN(Number(line.trim()));
  });
}
