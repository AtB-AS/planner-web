import { PropsWithChildren } from 'react';
import style from './layout.module.css';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import { MonoIcon, MonoIcons } from '@atb/components/icon';

export type ContactPage = {
  title: TranslatedString;
  href: string;
  icon: MonoIcons;
};

export const contactPages: ContactPage[] = [
  {
    title: PageText.Contact.ticketControl.title,
    href: '/kontakt/billettkontroll-og-gebyr',
    icon: 'ticketing/TicketInvalid',
  },
  {
    title: PageText.Contact.travelGuarantee.title,
    href: '/kontakt/reisegaranti',
    icon: 'transportation-entur/Taxi',
  },
  {
    title: PageText.Contact.modeOfTransport.title,
    href: '/kontakt/transportmiddel-og-stoppested',
    icon: 'transportation/Bus',
  },
  {
    title: PageText.Contact.ticketsApp.title,
    href: '/kontakt/billette-og-app',
    icon: 'devices/Phone',
  },
  {
    title: PageText.Contact.lostAndFound.title,
    href: '/kontakt/hittegods',
    icon: 'actions/Support',
  },
  {
    title: PageText.Contact.groupTravel.title,
    href: '/kontakt/gruppereise',
    icon: 'ticketing/TicketMultiple',
  },
];

export type ContactPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function ContactPageLayout({ children }: ContactPageLayoutProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div className={style.layout__container}>
      <h2>{t(PageText.Contact.title)}</h2>
      <nav className={style.contact_page_navigator__container}>
        {contactPages.map((contactPage, index) => {
          const isActive = pathname.includes(contactPage.href);

          return (
            <Link
              key={index}
              shallow={true}
              href={contactPage.href}
              className={andIf({
                [style.contact_page_navigator__link]: true,
                [style.contact_page_navigator__activePage]: isActive,
              })}
            >
              <MonoIcon size="large" icon={contactPage.icon} />
              <Typo.p
                textType={isActive ? 'body__primary--bold' : 'body__primary'}
              >
                {t(contactPage.title)}
              </Typo.p>
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}

export default ContactPageLayout;
