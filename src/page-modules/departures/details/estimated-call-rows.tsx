import { EstimatedCallWithMetadata } from '../types';
import { PageText, useTranslation } from '@atb/translations';
import { useState } from 'react';
import style from './details.module.css';
import { motion } from 'framer-motion';
import { Typo } from '@atb/components/typography';
import { MonoIcon } from '@atb/components/icon';
import { Button } from '@atb/components/button';
import { useTransportationThemeColor } from '@atb/modules/transport-mode';
import {
  SituationMessageBox,
  SituationOrNoticeIcon,
} from '@atb/modules/situations';
import { formatQuayName, getSituationsToShowForCall } from './utils';
import { DecorationLine, TripRow } from '@atb/modules/trip-details';
import { DepartureTime } from '@atb/components/departure-time';
import { SituationFragment } from '@atb/page-modules/assistant/journey-gql/trip.generated.ts';

export type EstimatedCallRowsProps = {
  calls: EstimatedCallWithMetadata[];
  mode: string;
  subMode?: string;
  alreadyShownSituationNumbers: string[];
};

export function EstimatedCallRows({
  calls,
  mode,
  subMode,
  alreadyShownSituationNumbers,
}: EstimatedCallRowsProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(true);

  const passedCalls = calls.filter((c) => c.metadata.group === 'passed');
  const showCollapsable = passedCalls.length > 1;

  const estimatedCallsToShow = calls.filter(
    (c) => c.metadata.group !== 'passed',
  );

  const passedCallsToShow = collapsed ? [passedCalls[0]] : passedCalls;

  const collapseButton = showCollapsable ? (
    <Button
      onClick={() => setCollapsed(!collapsed)}
      title={t(
        PageText.Departures.details.collapse.label(passedCalls.length - 1),
      )}
      mode="transparent"
      size="compact"
      icon={{
        right: collapsed ? (
          <MonoIcon icon="navigation/ExpandMore" />
        ) : (
          <MonoIcon icon="navigation/ExpandLess" />
        ),
      }}
      className={style.collapseButton}
      buttonProps={{
        'aria-label': t(PageText.Departures.details.collapse.a11yHint),
      }}
    />
  ) : null;

  return (
    <div className={style.callRows}>
      {passedCalls.length > 0 && (
        <div className={style.callRows__container}>
          {passedCallsToShow.map((call, i) => (
            <motion.div
              key={`${call.quay.id}-${call.aimedDepartureTime}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: i * 0.05,
              }}
            >
              <EstimatedCallRow
                call={call}
                mode={mode}
                subMode={subMode}
                collapseButton={
                  call.metadata.isStartOfServiceJourney ? collapseButton : null
                }
                situations={getSituationsToShowForCall(
                  call,
                  alreadyShownSituationNumbers,
                )}
              />
            </motion.div>
          ))}
        </div>
      )}

      <div
        className={style.callRows__container}
        data-testid="estimatedCallRows"
      >
        {estimatedCallsToShow.map((call, i) => (
          <motion.div
            key={`${call.quay.id}-${call.aimedDepartureTime}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: i * 0.015,
            }}
          >
            <EstimatedCallRow
              call={call}
              mode={mode}
              subMode={subMode}
              collapseButton={null}
              situations={getSituationsToShowForCall(
                call,
                alreadyShownSituationNumbers,
              )}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type EstimatedCallRowProps = {
  call: EstimatedCallWithMetadata;
  mode: string;
  subMode?: string;
  collapseButton: JSX.Element | null;
  situations: SituationFragment[];
};

function EstimatedCallRow({
  call,
  mode,
  subMode,
  collapseButton,
  situations,
}: EstimatedCallRowProps) {
  const { t } = useTranslation();
  const { group, isStartOfGroup, isEndOfGroup } = call.metadata;
  const isBetween = !isStartOfGroup && !isEndOfGroup;
  const iconColor = useTransportationThemeColor({
    transportMode: group === 'trip' ? mode : 'unknown',
    transportSubModes: subMode ? [subMode] : undefined,
  });

  return (
    <div className={style.rowContainer}>
      <DecorationLine
        hasStart={isStartOfGroup}
        hasCenter={isBetween}
        hasEnd={isEndOfGroup}
        color={iconColor.backgroundColor}
      />
      <TripRow
        rowLabel={
          <DepartureTime
            aimedDepartureTime={call.aimedDepartureTime}
            expectedDepartureTime={call.expectedDepartureTime}
            realtime={call.realtime}
          />
        }
        alignChildren={
          isStartOfGroup ? 'flex-start' : isEndOfGroup ? 'flex-end' : 'center'
        }
        isBetween={isBetween}
        href={`/departures/${call.quay.stopPlace?.id}`}
      >
        <Typo.p textType="body__primary">
          {formatQuayName(t, call.quay.name, call.quay.publicCode)}
        </Typo.p>
        {!call.forAlighting && !call.metadata.isStartOfServiceJourney && (
          <Typo.p textType="body__secondary" className={style.boardingInfo}>
            {t(PageText.Departures.details.messages.noAlighting)}
          </Typo.p>
        )}
        {!call.forBoarding && !call.metadata.isEndOfServiceJourney && (
          <Typo.p textType="body__secondary" className={style.boardingInfo}>
            {t(PageText.Departures.details.messages.noBoarding)}
          </Typo.p>
        )}
      </TripRow>
      {situations.map((situation) => (
        <TripRow
          key={situation.situationNumber}
          rowLabel={<SituationOrNoticeIcon situation={situation} />}
        >
          <SituationMessageBox noStatusIcon={true} situation={situation} />
        </TripRow>
      ))}
      {collapseButton}
    </div>
  );
}
