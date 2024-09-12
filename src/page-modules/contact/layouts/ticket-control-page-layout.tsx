import { PropsWithChildren } from 'react';
import { SectionCard } from '../components/section-card';
import { useRouter } from 'next/router';
import { PageText, useTranslation } from '@atb/translations';
import { Checkbox } from '../components/input/checkbox';

export type TicketControlPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function TicketControlPageLayout({ children }: TicketControlPageLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div>
      <SectionCard title={PageText.Contact.ticketControl.title}>
        <ul>
          <Checkbox
            label={t(PageText.Contact.ticketControl.subPageTitles.feeComplaint)}
            checked={router.pathname.includes('/complaint')}
            onChange={() =>
              router.push('/contact/ticket-control/complaint', undefined, {
                shallow: true,
              })
            }
          />
          <Checkbox
            label={t(PageText.Contact.ticketControl.subPageTitles.postpone)}
            checked={router.pathname.includes('/postpone-payment')}
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
          <Checkbox
            label={t(PageText.Contact.ticketControl.subPageTitles.feedback)}
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
