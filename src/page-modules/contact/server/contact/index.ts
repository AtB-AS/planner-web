import { HttpRequester } from '@atb/modules/api-server';
import { ContactApiReturnType } from '../types';

export type ContactApi = {
  submitTicketControlForm(formData: any): Promise<ContactApiReturnType>;
};

export function createContactApi(
  request: HttpRequester<'http-contact-api'>,
): ContactApi {
  return {
    async submitTicketControlForm(formData) {
      const response = await request('/ticket-control', {
        method: 'POST',
        body: formData,
      });
      const data: ContactApiReturnType = await response.json();
      return data;
    },
  };
}
