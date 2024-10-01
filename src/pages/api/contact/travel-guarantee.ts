import { tryResult } from '@atb/modules/api-server';
import { handlerWithContactFormClient } from '@atb/page-modules/contact/server';
import { TravelGuaranteeApiReturnType } from '@atb/page-modules/contact/server/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default handlerWithContactFormClient<TravelGuaranteeApiReturnType>({
  async POST(req: NextApiRequest, res: NextApiResponse, { client, ok }) {
    console.log('hei 1');

    return tryResult(req, res, async () => {
      return ok(await client.submitTravelGuaranteeForm(req.body));
    });
  },
});
