import { tryResult } from '@atb/modules/api-server';
import { handlerWithContactFormClient } from '@atb/page-modules/contact/server';
import { Line } from '@atb/page-modules/contact';
import { NextApiRequest, NextApiResponse } from 'next';

export default handlerWithContactFormClient<Line[]>({
  async GET(req: NextApiRequest, res: NextApiResponse, { client, ok }) {
    return tryResult(req, res, async () => {
      return ok(await client.lines());
    });
  },
});
