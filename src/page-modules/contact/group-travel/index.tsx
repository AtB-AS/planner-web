import { PageText, useTranslation } from '@atb/translations';
import { Typo } from '@atb/components/typography';

import { SectionCard } from '../components';
import Link from 'next/link';

export default function GroupTravelContent() {
  const { t } = useTranslation();

  return (
    <SectionCard title={t(PageText.Contact.groupTravel.title)}>
      <Typo.p textType="body__m">
        {t(PageText.Contact.groupTravel.description.info)}{' '}
        <Link href={t(PageText.Contact.groupTravel.description.url)}>
          {t(PageText.Contact.groupTravel.description.externalLink)}
        </Link>
      </Typo.p>
    </SectionCard>
  );
}
