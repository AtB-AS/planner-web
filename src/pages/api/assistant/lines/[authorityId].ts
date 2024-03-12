import { tryResult } from '@atb/modules/api-server';
import { LinesApiReturnType } from '@atb/page-modules/assistant/client';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

export default handlerWithAssistantClient<LinesApiReturnType>({
  async GET(req, res, { client, ok }) {
    const { authorityId } = req.query;
    const authorities: string[] = [];

    if (typeof authorityId === 'string') {
      authorities.push(authorityId);
    }

    return tryResult(req, res, async () => {
      return ok(
        await client.lines({
          authorities: authorities,
        }),
      );
    });
  },
});
