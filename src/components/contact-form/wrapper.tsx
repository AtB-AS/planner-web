import {
  ContactFormRoot,
  Language as ContactFormLanguage,
} from '@mrfylke/contact-form';
import { contactFormConfig } from '@atb/config/contact-form-config';
import { useLanguageSettings } from '@atb/translations';
import { useDarkMode } from '@atb/modules/theme';

type ContactFormWrapperProps = {
  children: React.ReactNode;
};

export function ContactFormWrapper({ children }: ContactFormWrapperProps) {
  const { language } = useLanguageSettings();
  const [isDarkMode] = useDarkMode();

  return (
    <ContactFormRoot
      config={contactFormConfig}
      language={language as ContactFormLanguage}
      theme={isDarkMode ? 'dark' : 'light'}
    >
      {children}
    </ContactFormRoot>
  );
}
