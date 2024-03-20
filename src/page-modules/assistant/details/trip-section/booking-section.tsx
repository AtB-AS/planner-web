import { ButtonLink } from '@atb/components/button';
import { ColorIcon, MonoIcon } from '@atb/components/icon';
import { MessageBox } from '@atb/components/message-box';
import {
  BookingArrangement,
  BookingStatus,
  getBookingStatus,
  getEarliestBookingDate,
  getLatestBookingDate,
} from '@atb/modules/flexible';
import { TripRow } from '@atb/modules/trip-details';
import { PageText, useTranslation } from '@atb/translations';
import { formatToShortDateTimeWithRelativeDayNames } from '@atb/utils/date';

type BookingSectionProps = {
  bookingStatus: BookingStatus;
  bookingArrangements: BookingArrangement;
  aimedStartTime: string;
};

export function BookingSection({
  bookingStatus,
  bookingArrangements,
  aimedStartTime,
}: BookingSectionProps) {
  const { t } = useTranslation();
  const bookingMessage = useBookingMessage(bookingArrangements, aimedStartTime);
  const bookingPhone = bookingArrangements.bookingContact?.phone;
  const bookingUrl = bookingArrangements.bookingContact?.url;

  const bookingMethods = bookingArrangements.bookingMethods;

  const showBookOnlineOption =
    bookingUrl &&
    bookingMethods?.some((bookingMethod) => bookingMethod === 'online');
  const showBookByPhoneOption =
    bookingPhone &&
    bookingMethods?.some((bookingMethod) => bookingMethod === 'callOffice');

  return (
    <>
      <TripRow
        rowLabel={
          <ColorIcon
            icon={bookingStatus === 'late' ? 'status/Error' : 'status/Warning'}
          />
        }
      >
        {bookingMessage && (
          <MessageBox
            type={bookingStatus === 'late' ? 'error' : 'warning'}
            message={bookingMessage}
          />
        )}
      </TripRow>

      {bookingStatus === 'bookable' && (
        <TripRow>
          {showBookOnlineOption && (
            <ButtonLink
              title={t(
                PageText.Assistant.details.tripSection.flexibleTransport
                  .bookOnline,
              )}
              href={bookingUrl}
              size="small"
              mode="interactive_0"
              icon={{ right: <MonoIcon icon="navigation/ExternalLink" /> }}
            />
          )}

          {showBookByPhoneOption && (
            <ButtonLink
              title={t(
                PageText.Assistant.details.tripSection.flexibleTransport.bookByPhone(
                  bookingPhone,
                ),
              )}
              href={`tel:${bookingPhone}`}
              size="small"
              mode="interactive_3"
              icon={{ right: <MonoIcon icon="navigation/ExternalLink" /> }}
            />
          )}
        </TripRow>
      )}
    </>
  );
}

const useBookingMessage = (
  bookingArrangements: BookingArrangement | undefined,
  aimedStartTime: string,
): string | undefined => {
  const { t, language } = useTranslation();
  if (!bookingArrangements) return undefined;

  const status = getBookingStatus(bookingArrangements, aimedStartTime, 7);

  const formatDate = (date: Date) =>
    formatToShortDateTimeWithRelativeDayNames(new Date(), date, t, language);

  switch (status) {
    case 'early': {
      const earliestBookingDate = getEarliestBookingDate(
        bookingArrangements,
        aimedStartTime,
        7,
      );
      return t(
        PageText.Assistant.details.tripSection.flexibleTransport.needsBookingButIsTooEarly(
          formatDate(earliestBookingDate),
        ),
      );
    }
    case 'bookable': {
      const latestBookingDate = getLatestBookingDate(
        bookingArrangements,
        aimedStartTime,
      );
      return t(
        PageText.Assistant.details.tripSection.flexibleTransport.needsBookingAndIsAvailable(
          formatDate(latestBookingDate),
        ),
      );
    }
    case 'late': {
      return t(
        PageText.Assistant.details.tripSection.flexibleTransport
          .needsBookingButIsTooLate,
      );
    }
    case 'none':
      return undefined;
  }
};
