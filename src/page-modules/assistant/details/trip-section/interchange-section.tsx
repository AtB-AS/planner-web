import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import { TripRow } from '@atb/modules/trip-details';
import { MonoIcon, TintedMonoIcon, type MonoIcons } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import { and } from '@atb/utils/css';
import style from './trip-section.module.css';
import { secondsToDuration } from '@atb/utils/date';
import { LegWithDetailsFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';

type Interchange = NonNullable<LegWithDetailsFragment['interchangeTo']>;
type InterchangeServiceJourney = Interchange['fromServiceJourney'];

type Props = {
  interchange: Interchange;
};

export function InterchangeSection({ interchange }: Props) {
  const { t, language } = useTranslation();
  const texts = PageText.Assistant.details.tripSection;

  const fromPublicCode = getPublicCode(interchange.fromServiceJourney);
  const toPublicCode = getPublicCode(interchange.toServiceJourney);

  if (interchange.staySeated) {
    return (
      <InterchangeRow
        icon="miscellaneous/StaySeated"
        boxed
        title={t(texts.staySeatedMainText)}
        message={t(texts.staySeatedSubText(fromPublicCode, toPublicCode))}
      />
    );
  }

  const maxWaitTime =
    interchange.maximumWaitTime && interchange.maximumWaitTime > 0
      ? secondsToDuration(interchange.maximumWaitTime, language)
      : undefined;

  return (
    <InterchangeRow
      icon="miscellaneous/Connection"
      title={t(texts.interchangeMainText)}
      message={t(texts.interchangeSubText(maxWaitTime))}
    />
  );
}

const getPublicCode = (sj: InterchangeServiceJourney) =>
  sj?.publicCode ?? sj?.line.publicCode;

type InterchangeRowProps = {
  icon: MonoIcons;
  title: string;
  message: string;
  boxed?: boolean;
};

function InterchangeRow({ icon, title, message, boxed }: InterchangeRowProps) {
  const walkColor = useTransportationThemeColor({ transportMode: 'foot' });

  return (
    <div className={and(style.rowContainer, style.interchangeRow)}>
      <TripRow
        rowLabel={
          <span className={style.interchangeRowLabel}>
            {boxed ? (
              <span
                className={style.interchangeIconBox}
                style={{
                  backgroundColor: walkColor.backgroundColor,
                  color: walkColor.textColor,
                }}
              >
                <TintedMonoIcon icon={icon} />
              </span>
            ) : (
              <MonoIcon icon={icon} />
            )}
          </span>
        }
      >
        <div className={style.interchangeContent}>
          <Typo.p textType="body__m">{title}</Typo.p>
          <Typo.p textType="body__s" className={style.textColor__secondary}>
            {message}
          </Typo.p>
        </div>
      </TripRow>
    </div>
  );
}
