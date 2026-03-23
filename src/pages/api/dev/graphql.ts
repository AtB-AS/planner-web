import type { NextApiRequest, NextApiResponse } from 'next';
import { DEV_MODE_COOKIE_NAME } from '@atb/modules/cookies/constants';
import { mapRawTripResponse } from '@atb/page-modules/assistant/server/journey-planner';
import { TripsWithDetailsQuery } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { TripsWithDetailsQueryVariables } from '@atb/page-modules/assistant/journey-gql/trip-with-details.generated';
import { currentOrg } from '@atb/modules/org-data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.cookies[DEV_MODE_COOKIE_NAME] !== 'true') {
    return res.status(403).json({ error: 'Dev mode not enabled' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, variables } = req.body;

  const enturUrl = `${process.env.ENTUR_BASE_URL ?? 'https://api.entur.io'}/journey-planner/v3/graphql`;
  const response = await fetch(enturUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ET-Client-Name': `${currentOrg}-planner-web`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const raw = await response.json();

  let tripPatterns: unknown = undefined;
  if (raw?.data?.trip?.tripPatterns) {
    try {
      const mapped = mapRawTripResponse(
        raw.data.trip as TripsWithDetailsQuery['trip'],
        variables as unknown as TripsWithDetailsQueryVariables,
      );
      tripPatterns = mapped.tripPatterns;
    } catch {
      // Transformation failed (e.g. custom query with different shape) — skip
    }
  }

  return res.status(200).json({ raw, tripPatterns });
}
