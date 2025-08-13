import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import style from './success-content.module.css';

export function SuccessContent() {
  const { t } = useTranslation();
  return (
    <section className={style.container}>
      <Typo.h2 textType="heading--big">
        {t(PageText.Contact.success.title)}
      </Typo.h2>
      <Typo.p textType="body__primary">
        {t(PageText.Contact.success.info)}
      </Typo.p>
    </section>
  );
}
