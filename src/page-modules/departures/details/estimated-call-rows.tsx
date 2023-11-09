import { TransportModeType } from '@atb/components/transport-mode/types';
import { EstimatedCallWithMetadata } from '../types';
import { PageText, useTranslation } from '@atb/translations';
import { PropsWithChildren, useState } from 'react';
import style from './details.module.css';
import { motion } from 'framer-motion';
import { useTransportationThemeColor } from '@atb/components/transport-mode/transport-icon';
import { Typo } from '@atb/components/typography';
import { MonoIcon } from '@atb/components/icon';
import { Button } from '@atb/components/button';
import Link from 'next/link';
import DepartureTime from './departure-time';
import DecorationLine from './decoration-line';

export type EstimatedCallRowsProps = {
  calls: EstimatedCallWithMetadata[];
  mode: TransportModeType;
};

export function EstimatedCallRows({ calls, mode }: EstimatedCallRowsProps) {
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
                collapseButton={
                  call.metadata.isStartOfServiceJourney ? collapseButton : null
                }
              />
            </motion.div>
          ))}
        </div>
      )}

      <div className={style.callRows__container}>
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
            <EstimatedCallRow call={call} mode={mode} collapseButton={null} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type EstimatedCallRowProps = {
  call: EstimatedCallWithMetadata;
  mode: TransportModeType;
  collapseButton: JSX.Element | null;
};
function EstimatedCallRow({
  call,
  mode,
  collapseButton,
}: EstimatedCallRowProps) {
  const { t } = useTranslation();
  const { group, isStartOfGroup, isEndOfGroup } = call.metadata;
  const isBetween = !isStartOfGroup && !isEndOfGroup;
  const iconColor = useTransportationThemeColor({
    mode: group === 'trip' ? mode : 'unknown',
  });

  return (
    <div className={style.rowContainer}>
      <DecorationLine
        hasStart={isStartOfGroup}
        hasCenter={isBetween}
        hasEnd={isEndOfGroup}
        color={iconColor.backgroundColor}
      />
      <Row
        rowLabel={
          <DepartureTime
            aimedDepartureTime={call.aimedDepartureTime}
            expectedDepartureTime={call.expectedDepartureTime}
            realtime={call.realtime}
            isStartOfServiceJourney
          />
        }
        alignChildren={
          isStartOfGroup ? 'flex-start' : isEndOfGroup ? 'flex-end' : 'center'
        }
        isBetween={isBetween}
        href={`/departures/${call.quay.stopPlace.id}`}
      >
        <Typo.p textType="body__primary">{call.quay.name}</Typo.p>
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
      </Row>
      {collapseButton}
    </div>
  );
}

type RowProps = PropsWithChildren<{
  rowLabel?: React.ReactNode;
  alignChildren?: 'flex-start' | 'flex-end' | 'center';
  href?: string;
  isBetween?: boolean;
}>;
function Row({
  rowLabel,
  children,
  alignChildren = 'center',
  href,
  isBetween = false,
}: RowProps) {
  const rowContent = (
    <>
      <div className={style.leftColumn}>{rowLabel}</div>
      <div className={style.decorationPlaceholder} />
      <div className={style.rightColumn}>{children}</div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={[style.row, isBetween && style.middleRow].join(' ')}
        style={{ alignItems: alignChildren }}
      >
        {rowContent}
      </Link>
    );
  }

  return (
    <div
      className={[style.row, isBetween && style.middleRow].join(' ')}
      style={{ alignItems: alignChildren }}
    >
      {rowContent}
    </div>
  );
}
