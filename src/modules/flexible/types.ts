import { z } from 'zod';

export const bookingMethodSchema = z.union([
  z.literal('callDriver'),
  z.literal('callOffice'),
  z.literal('online'),
  z.literal('phoneAtStop'),
  z.literal('text'),
]);

export const purchaseWhenSchema = z.union([
  z.literal('advanceAndDayOfTravel'),
  z.literal('dayOfTravelOnly'),
  z.literal('other'),
  z.literal('timeOfTravelOnly'),
  z.literal('untilPreviousDay'),
]);

export const bookingArrangementSchema = z.object({
  bookingMethods: z.array(bookingMethodSchema).nullable(),
  latestBookingTime: z.string().nullable(),
  bookingNote: z.string().nullable(),
  bookWhen: purchaseWhenSchema.nullable(),
  minimumBookingPeriod: z.string().nullable(),
  bookingContact: z
    .object({
      contactPerson: z.string().nullable(),
      email: z.string().nullable(),
      url: z.string().nullable(),
      phone: z.string().nullable(),
      furtherDetails: z.string().nullable(),
    })
    .nullable(),
});

export type BookingStatus = 'none' | 'early' | 'bookable' | 'late';
export type TripPatternBookingStatus = Exclude<BookingStatus, 'early'>;
export type BookingArrangement = z.infer<typeof bookingArrangementSchema>;
