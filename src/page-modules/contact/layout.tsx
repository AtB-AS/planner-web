import { HomeLinkWithGlobalMessageLayout } from '@atb/layouts/shared/home-link-with-global-message-layout';
import { PropsWithChildren } from 'react';

export type ContactLayoutProps = PropsWithChildren<{}>;

function AssistantLayout({ children }: ContactLayoutProps) {
  return (
    <HomeLinkWithGlobalMessageLayout>
      {children}
    </HomeLinkWithGlobalMessageLayout>
  );
}

export default AssistantLayout;
