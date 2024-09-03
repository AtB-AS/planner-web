import { PageText } from '@atb/translations';
import { SectionCard } from '../components/section-card';
import { FeeComplaintForm } from './complaint/feeComplaintForm';
import { ContactForm, ContactFormSelector } from '../components/form-selector';
import { useRouter } from 'next/router';
import { renderSelectedPage } from '../utils';

const contactForms: ContactForm[] = [
  {
    description: PageText.Contact.ticketControl.optionDescriptions.feeComplaint,
    href: '/contact/billettkontroll-og-gebyr/klage',
    page: <FeeComplaintForm />,
  },
  {
    description: PageText.Contact.ticketControl.optionDescriptions.refund,
    href: '/contact/billettkontroll-og-gebyr/utsette-betaling',
    page: <div>Utsette betaling</div>,
  },
  {
    description: PageText.Contact.ticketControl.optionDescriptions.feedback,
    href: '/contact/billettkontroll-og-gebyr/tilbakemelding',
    page: <div>Tilbakemelding</div>,
  },
];

export type TicketControlAndFeeContentProps = { title: string };

export const TicketControlAndFeeContent = (
  props: TicketControlAndFeeContentProps,
) => {
  const router = useRouter();

  return (
    <div>
      <SectionCard title={PageText.Contact.ticketControl.title}>
        <ContactFormSelector contactForms={contactForms} />
      </SectionCard>

      {renderSelectedPage(contactForms, router.asPath)}
    </div>
  );
};
