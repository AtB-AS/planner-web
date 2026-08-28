import { Typo } from '@atb/components/typography';
import { SectionCard } from '@mrfylke/contact-form';
import { PageText, useTranslation } from '@atb/translations';

export default function LostPropertyStaticLinkContent() {
  const { t } = useTranslation();
  return (
    <SectionCard title={t(PageText.Contact.lostProperty.title)}>
      <Typo.p textType="body__m">
        <span>
          {t(PageText.Contact.lostProperty.description.info)}&nbsp;
          <a
            href={t(PageText.Contact.lostProperty.description.url)}
            target="_blank"
            rel="noreferrer"
          >
            {t(PageText.Contact.lostProperty.description.externalLink)}
          </a>
        </span>
      </Typo.p>
    </SectionCard>
  );
}
