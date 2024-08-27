export const shouldShowContactPage = (): boolean => {
  return process.env.NEXT_PUBLIC_CONTACT_API_URL ? true : false;
};
