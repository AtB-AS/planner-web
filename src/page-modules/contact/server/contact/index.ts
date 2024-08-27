import { HttpRequester } from '@atb/modules/api-server';
import { ContactApiInputType, ContactApiReturnType } from '../types';

export type ContactApi = {
  submitForm(body: ContactApiInputType): Promise<ContactApiReturnType>;
};

export function createContactApi(
  request: HttpRequester<'http-contact-api'>,
): ContactApi {
  return {
    async submitForm(body) {
      const response = await request('/', {
        method: 'POST',
        body: JSON.stringify({ body }),
      });

      const data: ContactApiReturnType = await response.json();
      return data;
    },
  };
}
