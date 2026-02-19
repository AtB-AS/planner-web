import { tryResult } from '@atb/modules/api-server';
import { handlerWithContactFormClient } from '@atb/server/contact';
import { ContactApiReturnType } from '@atb/server/contact/types';
import type { FormSchemaName } from '@mrfylke/contact-form';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

function getSubmitForFormType(
  client: {
    submitTicketControlForm: (body: unknown) => Promise<ContactApiReturnType>;
    submitRefundForm: (body: unknown) => Promise<ContactApiReturnType>;
    submitMeansOfTransportForm: (body: unknown) => Promise<ContactApiReturnType>;
    submitTicketingForm: (body: unknown) => Promise<ContactApiReturnType>;
    submitJourneyInfoForm: (body: unknown) => Promise<ContactApiReturnType>;
  },
  formType: FormSchemaName,
): (body: Record<string, unknown>) => Promise<ContactApiReturnType> {
  const map: Record<
    FormSchemaName,
    (body: Record<string, unknown>) => Promise<ContactApiReturnType>
  > = {
    ticketControl: (body) => client.submitTicketControlForm(body),
    refund: (body) => client.submitRefundForm(body),
    meansOfTransport: (body) => client.submitMeansOfTransportForm(body),
    ticketing: (body) => client.submitTicketingForm(body),
    journeyInfo: (body) => client.submitJourneyInfoForm(body),
  };
  return map[formType];
}

export default handlerWithContactFormClient<ContactApiReturnType>({
  async POST(req: NextApiRequest, res: NextApiResponse, { client, ok }) {
    return tryResult(req, res, async () => {
      const { formType, ...body } = req.body as Record<string, unknown> & {
        formType?: FormSchemaName;
      };
      if (
        !formType ||
        typeof formType !== 'string' ||
        !['ticketControl', 'refund', 'meansOfTransport', 'ticketing', 'journeyInfo'].includes(formType)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Missing or invalid formType',
        });
      }
      const submit = getSubmitForFormType(client, formType as FormSchemaName);
      return ok(await submit(body as Record<string, unknown>));
    });
  },
});
