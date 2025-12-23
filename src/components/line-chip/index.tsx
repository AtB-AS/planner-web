import { Typo } from '@atb/components/typography';
import style from './line-chip.module.css';
import {
  TransportIcon,
  useTransportationThemeColor,
} from '@atb/modules/transport-mode';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/modules/graphql-types/journeyplanner-types_v3.generated.ts';

export type LineChipProps = {
  transportMode: TransportMode;
  transportSubmode?: TransportSubmode;
  publicCode?: string;
};

export default function LineChip({
  transportMode,
  transportSubmode,
  publicCode,
}: LineChipProps) {
  const transportationColor = useTransportationThemeColor({
    transportMode,
    transportSubmode,
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
        transportMode={transportMode}
        transportSubmode={transportSubmode}
      />
      {publicCode && (
        <Typo.span className={style.publicCode} textType="body__m__strong">
          {publicCode}
        </Typo.span>
      )}
    </div>
  );
}
