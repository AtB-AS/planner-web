import { tryResult } from '@atb/modules/api-server';
import { handlerWithContactFormClient } from '@atb/page-modules/contact/server';
import { ContactApiReturnType } from '@atb/page-modules/contact/server/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default handlerWithContactFormClient<ContactApiReturnType>({
  async POST(req: NextApiRequest, res: NextApiResponse, { client, ok }) {
    return tryResult(req, res, async () => {
      return ok(await client.submitForm(req.body));
    });
  },
});