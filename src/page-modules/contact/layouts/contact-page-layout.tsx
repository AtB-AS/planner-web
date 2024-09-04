import { PropsWithChildren } from 'react';
import style from './layout.module.css';
import { HomeLinkWithGlobalMessageLayout } from '@atb/layouts/shared/home-link-with-global-message-layout';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { andIf } from '@atb/utils/css';
import { Typo } from '@atb/components/typography';

export type ContactPage = {
  title: TranslatedString;
  href: string;
};

export const contactPages: ContactPage[] = [
  {
    title: PageText.Contact.ticketControl.title,
    href: '/contact/billettkontroll-og-gebyr',
  },
  {
    title: PageText.Contact.travelGuarantee.title,
    href: '/contact/reisegaranti',
  },
  {
    title: PageText.Contact.modeOfTransport.title,
    href: '/contact/transportmiddel-og-stoppested',
  },
  {
    title: PageText.Contact.ticketsApp.title,
    href: '/contact/billette-og-app',
  },
  {
    title: PageText.Contact.lostAndFound.title,
    href: '/contact/hittegods',
  },
  {
    title: PageText.Contact.groupTravel.title,
    href: '/contact/gruppereise',
  },
];

export type ContactPageLayoutProps = PropsWithChildren<{
  title: string;
}>;

function ContactPageLayout({ children }: ContactPageLayoutProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <HomeLinkWithGlobalMessageLayout>
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
                {/*Add icon*/}
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
    </HomeLinkWithGlobalMessageLayout>
  );
}

export default ContactPageLayout;
