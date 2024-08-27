import { PropsWithChildren, useState } from 'react';
import { CategorySelector } from '@atb/components/category-selector';
import { HomeLinkWithGlobalMessageLayout } from '@atb/layouts/shared/home-link-with-global-message-layout';
import { TranslatedString } from '@atb/translations';

export type ContactLayoutProps = PropsWithChildren<{
  title: TranslatedString;
}>;

function ContactLayout({ children }: ContactLayoutProps) {
  return (
    <HomeLinkWithGlobalMessageLayout>
      <CategorySelector />
      {children}
    </HomeLinkWithGlobalMessageLayout>
  );
}

export default ContactLayout;
