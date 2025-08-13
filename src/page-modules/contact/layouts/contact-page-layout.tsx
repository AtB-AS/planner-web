import { PropsWithChildren, useEffect, useState } from 'react';
import style from './layout.module.css';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';
import { MonoIcon, MonoIcons } from '@atb/components/icon';
import { ButtonLink } from '@atb/components/button';

export type ContactPage = {
  title: TranslatedString;
  href: string;
  icon: MonoIcons;
};

export const contactPages: ContactPage[] = [
  {
    title: PageText.Contact.ticketControl.title,
    href: '/contact/ticket-control',
    icon: 'ticketing/TicketInvalid',
  },
  {
    title: PageText.Contact.refund.title,
    href: '/contact/refund',
    icon: 'transportation-entur/Taxi',
  },
  {
    title: PageText.Contact.modeOfTransport.title,
    href: '/contact/means-of-transport',
    icon: 'transportation/BusFill',
  },
  {
    title: PageText.Contact.ticketing.title,
    href: '/contact/ticketing',
    icon: 'devices/Phone',
  },
  {
    title: PageText.Contact.lostProperty.title,
    href: '/contact/lost-property',
    icon: 'actions/Support',
  },
  {
    title: PageText.Contact.groupTravel.title,
    href: '/contact/group-travel',
    icon: 'ticketing/TicketMultiple',
  },
  {
    title: PageText.Contact.journeyInfo.title,
    href: '/contact/journey-info',
    icon: 'actions/Feedback',
  },
];

const pagesWithoutPrivacyAndTerms = [
  '/contact/lost-property',
  '/contact/group-travel',
];

export type ContactPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function ContactPageLayout({ children }: ContactPageLayoutProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [selectedContactPage, setSelectedContactPage] = useState<
    ContactPage | undefined
  >(undefined);

  useEffect(() => {
    const activePage = contactPages.find((contactPage) =>
      pathname.includes(contactPage.href),
    );
    setSelectedContactPage(activePage);
  }, [pathname]);

  const displayPrivacyAndTerms = (contactPage?: ContactPage) => {
    if (!contactPage) return false;
    return !pagesWithoutPrivacyAndTerms.includes(contactPage.href);
  };

  return (
    <div className={style.layout}>
      <div>
        <div className={style.homeLink__container}>
          <ButtonLink
            mode="transparent"
            href="/"
            title={t(PageText.Contact.contactPageLayout.homeLink)}
            icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
          />
        </div>
        <div className={style.layout__container}>
          <Typo.h2 textType="heading--jumbo">
            {t(PageText.Contact.contactPageLayout.title)}
          </Typo.h2>

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
                  <Typo.p textType="body__primary">
                    {t(contactPage.title)}
                  </Typo.p>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {children}
      {displayPrivacyAndTerms(selectedContactPage) && (
        <div className={style.privacyAndTerms}>
          <Typo.p textType="body__secondary--bold">
            {t(PageText.Contact.contactPageLayout.privacyAndTerms)}
          </Typo.p>
        </div>
      )}
    </div>
  );
}

export default ContactPageLayout;
