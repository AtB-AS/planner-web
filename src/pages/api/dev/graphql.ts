import type { NextApiRequest, NextApiResponse } from 'next';
import { DEV_MODE_COOKIE_NAME } from '@atb/modules/cookies/constants';
import { errorResultAsJson } from '@atb/modules/api-server';
import { mapRawTripResponse } from '@atb/page-modules/assistant/server/journey-planner';
import { TripsWithDetailsQuery } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { TripsWithDetailsQueryVariables } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { currentOrg } from '@atb/modules/org-data';
import { ServerText } from '@atb/translations';
import { constants } from 'http2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.cookies[DEV_MODE_COOKIE_NAME] !== 'true') {
    return res.status(403).json({ error: 'Dev mode not enabled' });
  }
  if (req.method !== 'POST') {
    return errorResultAsJson(
      res,
      constants.HTTP_STATUS_METHOD_NOT_ALLOWED,
      ServerText.Endpoints.invalidMethod,
    );
  }

  const { query, variables } = req.body ?? {};

  if (typeof query !== 'string' || typeof variables !== 'object' || variables === null) {
    return errorResultAsJson(
      res,
      constants.HTTP_STATUS_BAD_REQUEST,
      ServerText.Endpoints.invalidData,
    );
  }

  const enturUrl = `${process.env.ENTUR_BASE_URL ?? 'https://api.entur.io'}/journey-planner/v3/graphql`;

  let response: Response;
  try {
    response = await fetch(enturUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ET-Client-Name': `${currentOrg}-planner-web`,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch {
    return errorResultAsJson(
      res,
      constants.HTTP_STATUS_BAD_GATEWAY,
      ServerText.Endpoints.serverError,
    );
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch {
    return errorResultAsJson(
      res,
      constants.HTTP_STATUS_BAD_GATEWAY,
      ServerText.Endpoints.serverError,
    );
  }

  let tripPatterns: unknown = undefined;
  if (
    raw &&
    typeof raw === 'object' &&
    'data' in raw &&
    (raw as any).data?.trip?.tripPatterns
  ) {
    try {
      const mapped = mapRawTripResponse(
        (raw as any).data.trip as TripsWithDetailsQuery['trip'],
        variables as unknown as TripsWithDetailsQueryVariables,
      );
      tripPatterns = mapped.tripPatterns;
    } catch {
      // Transformation failed (e.g. custom query with different shape) — skip
    }
  }

  return res.status(200).json({ raw, tripPatterns });
}
