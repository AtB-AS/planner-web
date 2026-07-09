import {
  getAffectedStopNames,
  getMessageTypeForSituation,
  getSituationSummary,
  messageTypeToColorIcon,
  validateEndTime,
} from './utils';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { useTranslation, getTextForLanguage } from '@atb/translations';
import style from './situation.module.css';
import { Button } from '@atb/components/button';
import { useRef } from 'react';
import dictionary from '@atb/translations/dictionary';
import { Situation as SituationTexts } from '@atb/translations/modules';
import { formatToLongDateTime } from '@atb/utils/date';
import { MessageBox, MessageBoxProps } from '@atb/components/message-box';
import Link from 'next/link';
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated.ts';

export type Props = {
  situation: SituationFragment;
  noStatusIcon?: MessageBoxProps['noStatusIcon'];
  statusIcon?: MessageBoxProps['statusIcon'];
  borderRadius?: boolean;
};

export const SituationMessageBox = ({
  situation,
  noStatusIcon,
  statusIcon,
  borderRadius = true,
}: Props) => {
  const { language, t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const messageType = getMessageTypeForSituation(situation);
  const text = getSituationSummary(situation, language);
  const validityPeriodText = useValidityPeriodText(situation.validityPeriod);
  const affectedStopsText = useAffectedStopNamesText(situation.affects);

  if (!text) return null;

  return (
    <>
      <dialog ref={dialogRef} className={style.dialog}>
        <div className={style.dialog__wrapper}>
          <div className={style.dialog__content}>
            <div className={style.dialog__title}>
              <ColorIcon icon={messageTypeToColorIcon(messageType)} />
              {situation.summary && (
                <Typo.h2 textType="body__m__strong">
                  {getTextForLanguage(situation.summary, language)}
                </Typo.h2>
              )}
            </div>

            <Typo.p textType="body__m">
              {getTextForLanguage(situation.description, language)}
            </Typo.p>
            {situation.advice && (
              <Typo.p textType="body__m">
                {getTextForLanguage(situation.advice, language)}
              </Typo.p>
            )}

            {situation.infoLinks &&
              situation.infoLinks.map((link) => (
                <Link href={link.uri} key={link.uri}>
                  {link.label || t(dictionary.readMore)}
                </Link>
              ))}

            {affectedStopsText && (
              <Typo.p textType="body__m">{affectedStopsText}</Typo.p>
            )}

            {validityPeriodText && (
              <div className={style.dialog__validity}>
                <MonoIcon icon="time/Time" />
                <Typo.p className={style.secondaryTextColor} textType="body__s">
                  {validityPeriodText}
                </Typo.p>
              </div>
            )}
          </div>
          <Button
            buttonProps={{ formMethod: 'dialog' }}
            title={t(dictionary.close)}
            mode="interactive_0"
            className={style.dialog__button}
            onClick={() => dialogRef.current?.close()}
          />
        </div>
      </dialog>
      <MessageBox
        borderRadius={borderRadius}
        type={messageType}
        noStatusIcon={noStatusIcon}
        statusIcon={statusIcon}
        message={text}
        onClickConfig={{
          text: t(dictionary.readMore),
          action: () => dialogRef.current?.showModal(),
        }}
      />
    </>
  );
};

/**
 * Get a string which lists the affected stop places. Up to 10 names are shown
 * in full; beyond that the list is truncated to 8 names followed by an "N other
 * stops" tail. Returns undefined if no stop places affected.
 */
export const useAffectedStopNamesText = (
  affects: SituationFragment['affects'],
) => {
  const { t, language } = useTranslation();
  const names = getAffectedStopNames(affects);
  if (names.length === 0) return undefined;

  const displayItems =
    names.length > 10
      ? [
          ...names.slice(0, 8),
          t(SituationTexts.affectedStopPlaces.otherStops(names.length - 8)),
        ]
      : names;

  const list = new Intl.ListFormat(language, { type: 'conjunction' }).format(
    displayItems,
  );
  return `${t(SituationTexts.affectedStopPlaces.header)} ${list}`;
};

export const useValidityPeriodText = (
  period?: SituationFragment['validityPeriod'],
) => {
  const { t, language } = useTranslation();

  const endTime = period?.endTime && validateEndTime(period.endTime);
  if (period?.startTime && endTime) {
    return t(
      SituationTexts.validity.fromAndTo(
        formatToLongDateTime(period.startTime, language),
        formatToLongDateTime(endTime, language),
      ),
    );
  }
  if (period?.startTime) {
    return t(
      SituationTexts.validity.from(
        formatToLongDateTime(period.startTime, language),
      ),
    );
  }
  if (endTime) {
    return t(
      SituationTexts.validity.to(formatToLongDateTime(endTime, language)),
    );
  }

  return undefined;
};
