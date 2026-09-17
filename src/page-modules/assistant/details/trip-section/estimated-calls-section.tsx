import { useState } from 'react';
import { Typo } from '@atb/components/typography';
import { TripRow } from '@atb/modules/trip-details';
import { DepartureTime } from '@atb/components/departure-time';
import { Button } from '@atb/components/button';
import { TintedMonoIcon } from '@atb/components/icon';
import { useTheme } from '@atb/modules/theme';
import { PageText, useTranslation } from '@atb/translations';
import { secondsToDurationShort } from '@atb/utils/date';
import { andIf } from '@atb/utils/css';
import { ExtendedLegType } from '@atb/page-modules/assistant';
import { filterNotices } from '@atb/modules/situations-and-notices';

import style from './trip-section.module.css';

export type EstimatedCallsSectionProps = {
  intermediateEstimatedCalls: ExtendedLegType['intermediateEstimatedCalls'];
  duration: number;
};

export function EstimatedCallsSection({
  intermediateEstimatedCalls,
  duration,
}: EstimatedCallsSectionProps) {
  const { t, language } = useTranslation();
  const { color } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const numberOfCalls = intermediateEstimatedCalls.length;
  if (numberOfCalls === 0) return null;

  return (
    <>
      <TripRow>
        <Button
          title={t(
            PageText.Assistant.details.tripSection.intermediateStops(
              numberOfCalls,
              secondsToDurationShort(duration, language),
            ),
          )}
          mode="secondary"
          backgroundColor={color.background.neutral[0]}
          size="pill"
          radiusSize="circular"
          display="inline"
          onClick={() => setExpanded(!expanded)}
          buttonProps={{ 'aria-expanded': expanded }}
          icon={{
            right: (
              <TintedMonoIcon
                icon="navigation/ExpandMore"
                size="small"
                className={andIf({
                  [style.chevron]: true,
                  [style.chevron__rotated]: expanded,
                })}
              />
            ),
          }}
        />
      </TripRow>

      {expanded &&
        intermediateEstimatedCalls.map((call) => {
          const infoTexts = [
            ...(!call.forAlighting
              ? [
                  {
                    key: 'noAlighting',
                    text: t(PageText.Assistant.details.tripSection.noAlighting),
                  },
                ]
              : []),
            ...(!call.forBoarding
              ? [
                  {
                    key: 'noBoarding',
                    text: t(PageText.Assistant.details.tripSection.noBoarding),
                  },
                ]
              : []),
            ...filterNotices(call.notices).map((notice) => ({
              key: notice.id,
              text: notice.text,
            })),
          ];
          return (
            <TripRow
              key={`${call.aimedDepartureTime}-${call.quay.name}`}
              rowLabel={
                <DepartureTime
                  aimedDepartureTime={call.aimedDepartureTime}
                  expectedDepartureTime={call.expectedDepartureTime}
                  realtime={call.realtime}
                  roundingMethod="floor"
                />
              }
              alignChildren="flex-start"
            >
              <div className={style.intermediateCallContent}>
                <Typo.p
                  textType="body__s"
                  className={style.textColor__secondary}
                >
                  {call.quay.name}
                </Typo.p>
                {infoTexts.map((info) => (
                  <Typo.p
                    key={info.key}
                    textType="body__s"
                    className={style.textColor__secondary}
                  >
                    {infoTexts.length > 1 ? `• ${info.text}` : info.text}
                  </Typo.p>
                ))}
              </div>
            </TripRow>
          );
        })}
    </>
  );
}
