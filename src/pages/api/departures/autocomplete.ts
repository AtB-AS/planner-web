import { errorResultAsJson, tryResult } from '@atb/modules/api-client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

export default handlerWithDepartureClient(
  async (req: NextApiRequest, res: NextApiResponse, client) => {
    // Only allow GET handlers
    // @TODO extend to "modern" handler (GET function in object).
    if (req.method !== 'GET') {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_METHOD_NOT_ALLOWED,
        ServerText.Endpoints.invalidMethod,
      );
    }

    // Validate input as string
    const query = z.string().safeParse(req.query.q);
    if (!query.success) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidMethod,
      );
    }

    return tryResult(req, res, async () => {
      const recentTickets = await client.autocomplete(String(query.data));
      return res.status(constants.HTTP_STATUS_OK).json(recentTickets);
    });
  },
);
