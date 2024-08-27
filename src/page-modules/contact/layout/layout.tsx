import { PropsWithChildren } from 'react';
import style from './layout.module.css';
import ContactPageNavigator from './contact-page-navigator';
import { HomeLinkWithGlobalMessageLayout } from '@atb/layouts/shared/home-link-with-global-message-layout';
import { PageText, useTranslation } from '@atb/translations';

export type ContactLayoutProps = PropsWithChildren<{
  title: string;
}>;

function ContactLayout({ children }: ContactLayoutProps) {
  const { t } = useTranslation();

  return (
    <HomeLinkWithGlobalMessageLayout>
      <div className={style.container}>
        <h2>{t(PageText.Contact.title)}</h2>
        <ContactPageNavigator />
        {children}
      </div>
    </HomeLinkWithGlobalMessageLayout>
  );
}

export default ContactLayout;
