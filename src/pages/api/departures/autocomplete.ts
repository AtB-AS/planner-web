import { errorResultAsJson, tryResult } from '@atb/modules/api-client';
import { handlerWithDepartureClient } from '@atb/page-modules/departures';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';
import type { NextApiRequest, NextApiResponse } from 'next';

export default handlerWithDepartureClient(
  async (req: NextApiRequest, res: NextApiResponse, client) => {
    if (req.method !== 'GET') {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_METHOD_NOT_ALLOWED,
        ServerText.Endpoints.invalidMethod,
      );
    }

    if (!req.query.q) {
      return errorResultAsJson(
        res,
        constants.HTTP_STATUS_BAD_REQUEST,
        ServerText.Endpoints.invalidMethod,
      );
    }

    return tryResult(req, res, async () => {
      const recentTickets = await client.autocomplete(String(req.query.q));
      return res.status(constants.HTTP_STATUS_OK).json(recentTickets);
    });
  },
);
