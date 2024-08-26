export const shouldShowContactPage = (): boolean => {
  return process.env.NEXT_PUBLIC_CONTACT_FORM_API_URL ? true : false;
};
