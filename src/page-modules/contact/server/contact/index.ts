import { HttpRequester } from '@atb/modules/api-server';
import { ContactApiReturnType, TravelGuaranteeApiReturnType } from '../types';

export type ContactApi = {
  submitTicketControlForm(formData: any): Promise<ContactApiReturnType>;
  submitTravelGuaranteeForm(
    formData: any,
  ): Promise<TravelGuaranteeApiReturnType>; /
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
      const data: TravelGuaranteeApiReturnType = await response.json();
      return data;
    },
  };
}
