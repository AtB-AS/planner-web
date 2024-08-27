import Link from 'next/link';
import { PageText, TranslatedString, useTranslation } from '@atb/translations';
import { Route } from 'next';
import style from './contact-page-navigator.module.css';

type Category = {
  name: TranslatedString;
  route: Route;
};

const categories: Category[] = [
  {
    name: PageText.Contact.ticketControl,
    route: '/billettkontroll-og-gebyr',
  },
  {
    name: PageText.Contact.travelGuarantee,
    route: '/reisegaranti',
  },
  {
    name: PageText.Contact.modeOfTransport,
    route: '/transportmiddel-og-stoppested',
  },
  {
    name: PageText.Contact.ticketsApp,
    route: '/billette-og-app',
  },
  {
    name: PageText.Contact.lostAndFound,
    route: '/hittegods',
  },
  {
    name: PageText.Contact.groupTravel,
    route: '/gruppereise',
  },
];

const ContactPageNavigator = () => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      {categories.map((category, index) => {
        return (
          <Link
            key={index}
            className={style.link}
            href={{ pathname: `/contact${category.route}` }}
          >
            {/*Add icon*/}
            <div className={style.link_content_text}>{t(category.name)}</div>
          </Link>
        );
      })}
    </div>
  );
};

export default ContactPageNavigator;
