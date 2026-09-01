import {
  ContactFormRoot,
  Language as ContactFormLanguage,
} from '@mrfylke/contact-form';
import { contactFormConfig } from '@atb/config/contact-form-config';
import { Language, useLanguageSettings } from '@atb/translations';
import { useDarkMode } from '@atb/modules/theme';
import { PropsWithChildren } from 'react';

export function ContactFormWrapper({ children }: PropsWithChildren) {
  const { language } = useLanguageSettings();
  const [isDarkMode] = useDarkMode();

  return (
    <ContactFormRoot
      config={contactFormConfig}
      language={toContactFormLanguage(language)}
      theme={isDarkMode ? 'dark' : 'light'}
    >
      {children}
    </ContactFormRoot>
  );
}

function toContactFormLanguage(language: Language): ContactFormLanguage {
  switch (language) {
    case Language.English:
      return ContactFormLanguage.English;
    case Language.Norwegian:
      return ContactFormLanguage.Norwegian;
    case Language.Nynorsk:
      return ContactFormLanguage.Nynorsk;
  }
}
