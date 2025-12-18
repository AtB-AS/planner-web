import { RadioSegments } from '@atb/components/radio-segments';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import style from './transfer-slack.module.css';
import { useState } from 'react';
import { getOrgData } from '@atb/modules/org-data';

type Props = {
  onChange: (transferSlack: number) => void;
  initialValue?: number;
};
/**
 * Input component for selecting the transfer slack, initialValue and onChange
 * are in seconds, while the user selects number of minutes.
 */
export function TransferSlackInput({ initialValue, onChange }: Props) {
  const { t } = useTranslation();
  const initialValueMinutes = Math.round(
    (initialValue === undefined ? defaultTransferSlack() : initialValue) / 60,
  );
  const [transferSlackMinutes, setTransferSlackMinutes] =
    useState<number>(initialValueMinutes);

  const optionListMinutes = [0, 2, 5, 10];

  return (
    <div>
      <Typo.h3 textType="body__m" className={style.heading}>
        {t(PageText.Assistant.search.transferSlack.label)}
      </Typo.h3>
      <RadioSegments
        name="transferSlackFilter"
        activeIndex={optionListMinutes.indexOf(transferSlackMinutes)}
        className={style.transferSlackSegments}
        options={optionListMinutes.map((transferSlack) => ({
          onPress: () => {
            setTransferSlackMinutes(transferSlack);
            onChange(transferSlack * 60);
          },
          text: t(
            PageText.Assistant.search.transferSlack.option(transferSlack),
          ),
        }))}
      />
    </div>
  );
}

export function defaultTransferSlack() {
  const orgData = getOrgData();
  return orgData.journeyApiConfigurations.defaultTransferSlack ?? 0;
}
