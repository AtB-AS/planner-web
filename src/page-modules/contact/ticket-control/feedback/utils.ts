import { TransportModeType } from '@atb-as/config-specs';
import { TicketData, User } from '../../server/types';
import { Line } from '../..';
import { ComponentText } from '@atb/translations';

export type ContextFeedbackForm = {
  transportMode: TransportModeType;
  line: Line;
  departureLocation: Line['quays'][0];
  arrivalLocation: Line['quays'][0];
  date: string;
  time: string;
  feedback: string;
  subject: string;
  firstname: string;
  lastname: string;
  email: string;
};

export function fromContextFeedbackFormToTicketData({
  transportMode,
  line,
  departureLocation,
  arrivalLocation,
  date,
  time,
  feedback,
  subject,
  firstname,
  lastname,
  email,
}: ContextFeedbackForm): TicketData {
  const travelInformation =
    `Reisemåte: ${ComponentText.TransportMode.modes[transportMode].no}\n` +
    `Linje: ${line.name}\n` +
    `Fra stoppested: ${departureLocation.name}\n` +
    `Til stoppested: ${arrivalLocation.name}\n` +
    `Dato: ${date}\n` +
    `Klokkeslett: ${time}\n`;

  const description = [
    travelInformation,
    `Tilbakemelding fra kunde: \n\n ${feedback}`,
  ].join('\n\n');

  const user: User = {
    firstname,
    lastname,
    email,
  };

  return {
    subject,
    description,
    user,
  };
}
