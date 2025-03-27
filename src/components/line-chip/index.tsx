import { Typo } from '@atb/components/typography';
import style from './line-chip.module.css';
import {
  TransportIcon,
  useTransportationThemeColor,
} from '@atb/modules/transport-mode';

export type LineChipProps = {
  transportMode: string;
  transportSubmode?: string;
  publicCode?: string;
};

export default function LineChip({
  transportMode,
  transportSubmode,
  publicCode,
}: LineChipProps) {
  const transportationColor = useTransportationThemeColor({
    transportMode: transportMode,
    transportSubModes: transportSubmode ? [transportSubmode] : [],
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
          transportMode: transportMode,
          transportSubModes: transportSubmode ? [transportSubmode] : [],
        }}
      />
      {publicCode && (
        <Typo.span className={style.publicCode} textType="body__primary--bold">
          {publicCode}
        </Typo.span>
      )}
    </div>
  );
}
