import { HttpRequester } from '@atb/modules/api-server';
import { ContactApiReturnType } from '../types';

export type ContactApi = {
  submitTicketControlForm(formData: any): Promise<ContactApiReturnType>;
  submitTravelGuaranteeForm(formData: any): Promise<ContactApiReturnType>;
  submitMeansOfTransportForm(formData: any): Promise<ContactApiReturnType>;
  submitTicketingForm(formData: any): Promise<ContactApiReturnType>;
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

    async submitTravelGuaranteeForm(formData) {
      const response = await request('/travel-guarantee', {
        method: 'POST',
        body: formData,
      });
      const data: ContactApiReturnType = await response.json();
      return data;
    },

    async submitMeansOfTransportForm(formData) {
      const response = await request('/means-of-transport', {
        method: 'POST',
        body: formData,
      });
      const data: ContactApiReturnType = await response.json();
      return data;
    },

    async submitTicketingForm(formData) {
      const response = await request('/ticketing', {
        method: 'POST',
        body: formData,
      });
      const data: ContactApiReturnType = await response.json();
      return data;
    },
  };
}
