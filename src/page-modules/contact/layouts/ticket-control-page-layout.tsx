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
            checked={router.pathname.includes('/complaint')}
            onChange={() =>
              router.push('/contact/ticket-control/complaint', undefined, {
                shallow: true,
              })
            }
          />
          <Input
            label={PageText.Contact.ticketControl.subPageTitles.postpone}
            type="radio"
            checked={router.pathname.includes('/postpone-paymnet')}
            onChange={() =>
              router.push(
                '/contact/ticket-control/postpone-payment',
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
            checked={router.pathname.includes('/feedback')}
            onChange={() =>
              router.push('/contact/ticket-control/feedback', undefined, {
                shallow: true,
              })
            }
          />
        </ul>
      </SectionCard>

      {children}
    </div>
  );
}

export default TicketControlPageLayout;
