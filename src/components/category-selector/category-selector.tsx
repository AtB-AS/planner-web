import Link from 'next/link';
import {
  ComponentText,
  TranslatedString,
  useTranslation,
} from '@atb/translations';
import { Route } from 'next';
import { Typo } from '../typography';
import style from './category-selector.module.css';
import { ColorIcon } from '../icon';

type Category = {
  name: TranslatedString;
  route: Route;
};

const categories: Category[] = [
  {
    name: ComponentText.CategorySelector.ticketControl,
    route: '/contact/billettkontroll-og-gebyr',
  },
  {
    name: ComponentText.CategorySelector.travelGuarantee,
    route: '/contact/reisegaranti',
  },
  {
    name: ComponentText.CategorySelector.modeOfTransport,
    route: '/contact/transportmiddel-og-stoppested',
  },
  {
    name: ComponentText.CategorySelector.ticketsApp,
    route: '/contact/billette-og-app',
  },
  {
    name: ComponentText.CategorySelector.lostAndFound,
    route: '/contact/hittegods',
  },
  {
    name: ComponentText.CategorySelector.groupTravel,
    route: '/contact/gruppereise',
  },
];

const CategorySelector = () => {
  const { t } = useTranslation();

  return (
    <div className={style.container}>
      {categories.map((category, index) => {
        return (
          <Link
            key={index}
            className={style.link}
            href={{ pathname: category.route }}
          >
            <div className={style.link_content}>
              <ColorIcon icon={'status/Check'} />
              <Typo.p textType={'body__primary--bold'}>
                {t(category.name)}
              </Typo.p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategorySelector;
