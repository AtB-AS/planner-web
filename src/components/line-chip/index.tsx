import {
  TransportIcon,
  useTransportationThemeColor,
} from '@atb/components/transport-mode/transport-icon';
import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb/components/transport-mode/types';
import { Typo } from '@atb/components/typography';
import style from './line-chip.module.css';

export type LineChipProps = {
  transportMode: TransportModeType;
  transportSubmode?: TransportSubmodeType;
  publicCode: string;
};

export default function LineChip({
  transportMode,
  transportSubmode,
  publicCode,
}: LineChipProps) {
  const transportationColor = useTransportationThemeColor({
    mode: transportMode,
    subMode: transportSubmode,
  });

  return (
    <div
      className={style.container}
      style={{
        backgroundColor: transportationColor.backgroundColor,
        color: transportationColor.textColor,
      }}
    >
      <TransportIcon
        mode={{
          mode: transportMode,
          subMode: transportSubmode,
        }}
      />
      <Typo.span className={style.publicCode} textType="body__primary--bold">
        {publicCode}
      </Typo.span>
    </div>
  );
}
