import { ContactForm } from './components/form-selector';

export const shouldShowContactPage = (): boolean => {
  return process.env.NEXT_PUBLIC_CONTACT_API_URL ? true : false;
};

export const renderSelectedPage = (
  contactForms: ContactForm[],
  routerPath: string,
) => {
  const selectedForm = contactForms.find(
    (contactForm) => routerPath === contactForm.href,
  );

  if (selectedForm) {
    return selectedForm.page;
  }

  return null;
};
