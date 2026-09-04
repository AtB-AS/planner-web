import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import {
  Language,
  PageText,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import { secondsBetween, secondsToDuration } from '@atb/utils/date';
import style from './trip-section.module.css';
import { MonoIcon, TintedMonoIcon, type MonoIcons } from '@atb/components/icon';
import { ExtendedLegType } from '@atb/page-modules/assistant';
import { TransferRisk } from '@atb-as/utils';
import { and } from '@atb/utils/css';

// Set number of seconds required before showing short waiting indicator
const SHOW_SHORT_WAIT_TIME_THRESHOLD_IN_SECONDS = 180;

const ONE_MINUTE_IN_SECONDS = 60;

export type WaitSectionProps = {
  legWaitDetails?: LegWaitDetails;
};

export default function WaitSection({ legWaitDetails }: WaitSectionProps) {
  const { t, language } = useTranslation();

  if (!legWaitDetails) return null;

  const { waitTime, mustWaitForNextLeg, transferRisk } = legWaitDetails;
  const transfer = getTransferMessage(transferRisk, t);
  // Any wait at all is worth showing, matching the app. Stop times are rounded
  // to whole minutes — arrivals up, departures down — so a transfer of a few
  // seconds can read as if the next service leaves before this one arrives.
  // The message is what explains that.
  const showWait = mustWaitForNextLeg;

  // A transfer at risk has no wait time to show — the next departure is before
  // this arrival — so the two messages never appear together in practice.
  if (!transfer && !showWait) return null;

  return (
    <div className={and(style.rowContainer, style.waitRow)}>
      {transfer && <WaitMessageRow {...transfer} />}
      {showWait && (
        <WaitMessageRow {...getWaitMessage(waitTime, t, language)} />
      )}
    </div>
  );
}

type WaitMessage = {
  icon: MonoIcons;
  title?: string;
  message: string;
  /** Draws the icon and title in the named emphasis colour. */
  emphasis?: 'info' | 'error';
};

function getTransferMessage(
  transferRisk: TransferRisk | undefined,
  t: TranslateFunction,
): WaitMessage | undefined {
  if (!transferRisk) return undefined;
  const texts = PageText.Assistant.details.tripSection.wait.transfer.uncertain;
  return {
    icon: 'status/Unknown',
    emphasis: 'error',
    title: t(texts.label),
    message: t(texts.message),
  };
}

function getWaitMessage(
  waitTime: number,
  t: TranslateFunction,
  language: Language,
): WaitMessage {
  const texts = PageText.Assistant.details.tripSection.wait;

  if (waitTime > SHOW_SHORT_WAIT_TIME_THRESHOLD_IN_SECONDS) {
    return {
      icon: 'time/Time',
      message: t(texts.label(secondsToDuration(waitTime, language))),
    };
  }

  // Rounded up to whole minutes, so a 75-second wait reads "under 2 minutes"
  // rather than quoting seconds back at the reader. Matches the app.
  const wholeMinutes = Math.ceil(waitTime / ONE_MINUTE_IN_SECONDS);
  return {
    icon: 'status/Warning',
    emphasis: 'info',
    title: t(texts.shortTime),
    message: t(
      texts.shortWait(
        secondsToDuration(wholeMinutes * ONE_MINUTE_IN_SECONDS, language),
      ),
    ),
  };
}

function WaitMessageRow({ icon, title, message, emphasis }: WaitMessage) {
  const emphasisClass =
    emphasis === 'error'
      ? style.emphasis__error
      : emphasis === 'info'
        ? style.emphasis__info
        : undefined;

  return (
    <TripRow
      rowLabel={
        <span className={style.waitRowLabel}>
          {emphasis ? (
            <TintedMonoIcon icon={icon} className={emphasisClass} />
          ) : (
            <MonoIcon icon={icon} />
          )}
        </span>
      }
    >
      <div className={style.waitMessage}>
        {title && (
          <Typo.p
            textType="body__m"
            className={and(style.waitMessageTitle, emphasisClass)}
          >
            {title}
          </Typo.p>
        )}
        <Typo.p textType="body__m" className={style.waitTime}>
          {message}
        </Typo.p>
      </div>
    </TripRow>
  );
}

export type LegWaitDetails = {
  waitTime: number;
  mustWaitForNextLeg: boolean;
  transferRisk?: TransferRisk;
};
export function getLegWaitDetails(
  leg: ExtendedLegType,
  nextLeg: ExtendedLegType,
): LegWaitDetails | undefined {
  if (!nextLeg) return undefined;
  const waitTime = secondsBetween(
    leg.expectedEndTime,
    nextLeg.expectedStartTime,
  );
  const mustWaitForNextLeg = waitTime > 0;

  return {
    waitTime,
    mustWaitForNextLeg,
    // The risk is stamped on the leg you might miss, which is the one this
    // wait leads into.
    transferRisk: nextLeg.transferRisk,
  };
}
