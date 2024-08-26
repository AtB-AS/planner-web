import { HomeLinkWithGlobalMessageLayout } from '@atb/layouts/shared/home-link-with-global-message-layout';
import { PropsWithChildren } from 'react';

export type ContactLayoutProps = PropsWithChildren<{}>;

function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <HomeLinkWithGlobalMessageLayout>
      {children}
    </HomeLinkWithGlobalMessageLayout>
  );
}

export default ContactLayout;
