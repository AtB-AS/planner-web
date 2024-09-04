import { PropsWithChildren } from 'react';
import { SectionCard } from '../components/section-card';
import { Input } from '../components/input';
import { useRouter } from 'next/router';
import { PageText } from '@atb/translations';

export type ComplaintPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function ComplaintPageLayout({ children }: ComplaintPageLayoutProps) {
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
                '/contact/billettkontroll-og-gebyr/klage',
                undefined,
                {
                  shallow: true,
                },
              )
            }
          />
          <Input
            label={PageText.Contact.ticketControl.subPageTitles.refund}
            type="radio"
            checked={router.pathname.includes('/utsette-betaling')}
            onChange={() =>
              router.push(
                '/contact/billettkontroll-og-gebyr/klage',
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
                '/contact/billettkontroll-og-gebyr/tilbakemelding',
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

export default ComplaintPageLayout;
