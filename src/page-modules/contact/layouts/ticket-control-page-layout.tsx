import { PropsWithChildren } from 'react';
import { SectionCard } from '../components/section-card';
import { Input } from '../components/input';
import { useRouter } from 'next/router';
import { PageText } from '@atb/translations';

export type TicketControlPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function TicketControlPageLayout({ children }: TicketControlPageLayoutProps) {
  const router = useRouter();

  return (
    <div>
      <SectionCard title={PageText.Contact.ticketControl.title}>
        <ul>
          <Input
            label={PageText.Contact.ticketControl.subPageTitles.feeComplaint}
            type="radio"
            checked={router.pathname.includes('/klage')}
            onChange={() =>
              router.push(
                '/kontakt/billettkontroll-og-gebyr/klage',
                undefined,
                {
                  shallow: true,
                },
              )
            }
          />
          <Input
            label={PageText.Contact.ticketControl.subPageTitles.postpone}
            type="radio"
            checked={router.pathname.includes('/utsette-betaling')}
            onChange={() =>
              router.push(
                '/kontakt/billettkontroll-og-gebyr/utsette-betaling',
                undefined,
                {
                  shallow: true,
                },
              )
            }
          />
          <Input
            label={PageText.Contact.ticketControl.subPageTitles.feedback}
            type="radio"
            checked={router.pathname.includes('/tilbakemelding')}
            onChange={() =>
              router.push(
                '/kontakt/billettkontroll-og-gebyr/tilbakemelding',
                undefined,
                {
                  shallow: true,
                },
              )
            }
          />
        </ul>
      </SectionCard>

      {children}
    </div>
  );
}

export default TicketControlPageLayout;
