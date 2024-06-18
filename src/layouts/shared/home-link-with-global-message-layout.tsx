import { PropsWithChildren } from 'react';
import { ButtonLink } from '@atb/components/button';
import { getOrgData } from '@atb/modules/org-data';
import { PageText, useTranslation } from '@atb/translations';
import { MonoIcon } from '@atb/components/icon';
import {
  GlobalMessageContextEnum,
  GlobalMessages,
} from '@atb/modules/global-messages';
import style from './home-link-with-global-message-layout.module.css';

export function HomeLinkWithGlobalMessageLayout({
  children,
}: PropsWithChildren<{}>) {
  const { t } = useTranslation();
  const { urls } = getOrgData();

  return (
    <div>
      <div className={style.homeLink__container}>
        <ButtonLink
          mode="transparent"
          href={urls.homePageUrl.href}
          title={t(PageText.Departures.homeLink(urls.homePageUrl.name))}
          icon={{ left: <MonoIcon icon="navigation/ArrowLeft" /> }}
        />

        <GlobalMessages context={GlobalMessageContextEnum.plannerWeb} />
      </div>
      {children}
    </div>
  );
}
