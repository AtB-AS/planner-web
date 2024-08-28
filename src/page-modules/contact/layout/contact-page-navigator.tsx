import Link from 'next/link';
import { usePathname } from 'next/navigation';
import style from './layout.module.css';
import { Typo } from '@atb/components/typography';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { andIf } from '@atb/utils/css';

type ContactPage = {
  title: TranslatedString;
  href: string;
};

const contactPages: ContactPage[] = [
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

const ContactPageNavigator = () => {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <nav className={style.contact_page_navigator__container}>
      {contactPages.map((contactPage, index) => {
        const isActive = pathname.includes(contactPage.href);

        return (
          <Link
            key={index}
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
  );
};

export default ContactPageNavigator;
