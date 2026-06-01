import { Button } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { SearchTime } from '@atb/modules/search-time';
import { PageText, useTranslation } from '@atb/translations';
import { formatToLongDateTime } from '@atb/utils/date';
import { isToday } from 'date-fns';
import style from './date-navigation.module.css';

type DateNavigationProps = {
  searchTime: SearchTime;
  onChangeDay: (days: number) => void;
};

export function DateNavigation({
  searchTime,
  onChangeDay,
}: DateNavigationProps) {
  const { t, language } = useTranslation();
  const disablePreviousDay =
    searchTime.mode === 'now' || isToday(new Date(searchTime.dateTime));

  const dateText =
    searchTime.mode === 'now'
      ? t(PageText.Departures.stopPlace.dateNavigation.today)
      : formatToLongDateTime(new Date(searchTime.dateTime), language);

  return (
    <div className={style.dateNavigation}>
      <Button
        onClick={() => onChangeDay(-1)}
        icon={{ left: <MonoIcon icon="navigation/ChevronLeft" /> }}
        mode="interactive_2"
        radiusSize="circular"
        disabled={disablePreviousDay}
        buttonProps={{
          'aria-label': disablePreviousDay
            ? t(PageText.Departures.stopPlace.dateNavigation.a11yDisabled)
            : t(
                PageText.Departures.stopPlace.dateNavigation
                  .a11yPreviousDayHint,
              ),
        }}
        testID="previousDayButton"
        // For consistent layout, hide the button when disabled instead of
        // removing it from the DOM
        className={disablePreviousDay ? style.dateNavigation__buttonHidden : ''}
        aria-hidden={disablePreviousDay}
      />
      <Typo.span
        textType="body__s"
        className={style.dateNavigation__date}
        aria-label={t(
          PageText.Departures.stopPlace.dateNavigation.a11ySelectedLabel(
            dateText,
          ),
        )}
      >
        {dateText}
      </Typo.span>
      <Button
        onClick={() => onChangeDay(1)}
        icon={{ right: <MonoIcon icon="navigation/ChevronRight" /> }}
        mode="interactive_2"
        radiusSize="circular"
        buttonProps={{
          'aria-label': t(
            PageText.Departures.stopPlace.dateNavigation.a11yNextDayHint,
          ),
        }}
        testID="nextDayButton"
      />
    </div>
  );
}
