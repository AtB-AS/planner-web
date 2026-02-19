'use client';

import {
  ContactPageLayout,
  JourneyInfoContent,
  MeansOfTransportContent,
  RefundContent,
  TicketControlPageContent,
  TicketingContent,
  useContactFormConfig,
  PageText,
  ExternalLinkPage,
  SuccessContent,
  ErrorContent,
} from '@mrfylke/contact-form';
import LostPropertyContent from '@mrfylke/contact-form/lost-property';
import GroupTravelContent from '@mrfylke/contact-form/group-travel';
import { useRouter } from 'next/router';
import type { JSX } from 'react';

const slugToContent: Record<string, JSX.Element> = {
  'ticket-control': <TicketControlPageContent />,
  refund: <RefundContent />,
  'means-of-transport': <MeansOfTransportContent />,
  ticketing: <TicketingContent />,
  'lost-property': <LostPropertyContent />,
  'group-travel': <GroupTravelContent />,
  'journey-info': <JourneyInfoContent />,
};

type ContactFormContactContentProps = {
  slug?: string[] | null;
};

export function ContactFormContactContent({
  slug: slugProp,
}: ContactFormContactContentProps) {
  const router = useRouter();
  const { layout, pagesOverrides } = useContactFormConfig();
  const slug = (router.query.slug as string[] | undefined) ?? slugProp;
  const first = Array.isArray(slug) ? slug[0] : slug;
  const key = first ?? 'refund';

  const externalUrl = pagesOverrides?.externalUrlByPageId?.[key];

  let content: JSX.Element;
  if (externalUrl) {
    content = <ExternalLinkPage url={externalUrl} />;
  } else if (key === 'success') {
    content = (layout?.successContent ?? <SuccessContent />) as JSX.Element;
  } else if (key === 'error') {
    content = (layout?.errorContent ?? <ErrorContent />) as JSX.Element;
  } else {
    content = slugToContent[key] ?? <RefundContent />;
  }

  const backLink = layout?.backLinkDefault ?? {
    href: '/',
    label: PageText.Contact.contactPageLayout.homeLink,
  };

  if (key === 'success' || key === 'error') {
    return <>{content}</>;
  }

  return (
    <ContactPageLayout title="Contact" backLink={backLink}>
      {content}
    </ContactPageLayout>
  );
}
