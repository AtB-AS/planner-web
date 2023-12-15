import { ButtonLink } from '@atb/components/button';
import { MonoIcon } from '@atb/components/icon';
import { Typo } from '@atb/components/typography';
import { PageText, useTranslation } from '@atb/translations';
import style from './error-content.module.css';

export type ErrorContentProps = {
  statusCode: number;
  message?: string;
};

export function ErrorContent({ statusCode, message }: ErrorContentProps) {
  const { t } = useTranslation();
  const potential =
    PageText.Error[statusCode.toString() as keyof typeof PageText.Error];
  let errorMessage = potential ? t(potential) : undefined;
  if (!potential) {
    errorMessage = message;
  }
  if (!errorMessage) {
    errorMessage = t(PageText.Error.unknown);
  }

  return (
    <section className={style.container}>
      <ButtonLink
        mode="transparent"
        href="/"
        title={t(PageText.Error.backButton)}
        icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
      />
      <Typo.h2 textType="heading--big">{t(PageText.Error.title)}</Typo.h2>
      <Typo.p textType="body__primary">{errorMessage}</Typo.p>
    </section>
  );
}
