import { TicketData, User } from '../../server/types';

export type ContextComplaintForm = {
  subject: string;
  feeNumber: string;
  registeredMobile?: string;
  customerNumber?: string;
  travelcard?: string;
  feedback: string;
  firstname: string;
  lastname: string;
  address: string;
  postalCode: string;
  city: string;
  email: string;
  phonenumber: string;
  bankAccount: string;
};

export function fromContextComplaintFormToTicketData({
  subject,
  feeNumber,
  registeredMobile,
  customerNumber,
  travelcard,
  feedback,
  firstname,
  lastname,
  address,
  postalCode,
  city,
  email,
  phonenumber,
  bankAccount,
}: ContextComplaintForm): TicketData {
  let travelInformation = `Gebyrnnummer: ${feeNumber}\n`;
  if (registeredMobile) {
    travelInformation +=
      `Registrert telefon: ${registeredMobile}\n` +
      `Kundenummer: ${customerNumber}\n`;
  } else {
    travelInformation += `Reisekort: ${travelcard}\n`;
  }

  const description = [
    travelInformation,
    `Tilbakemelding fra kunde: \n\n ${feedback}`,
  ].join('\n\n');

  const user: User = {
    firstname,
    lastname,
    email,
    address,
    postalCode,
    city,
    phonenumber,
    bankAccount,
  };

  return {
    subject,
    description,
    user,
  };
}
