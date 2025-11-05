import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import style from './error-content.module.css';

export function ErrorContent() {
  const { t } = useTranslation();
  return (
    <section className={style.container}>
      <ButtonLink
        mode="transparent"
        href="/contact"
        title={t(PageText.Contact.error.backButton)}
        icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
      />
      <Typo.h2 textType="heading__xl">
        {t(PageText.Contact.error.title)}
      </Typo.h2>
      <Typo.p textType="body__m">{t(PageText.Contact.error.info)}</Typo.p>
    </section>
  );
}
