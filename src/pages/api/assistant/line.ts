import { tryResult } from '@atb/modules/api-server';
import { LinesApiReturnType } from '@atb/page-modules/assistant/client';
import { handlerWithAssistantClient } from '@atb/page-modules/assistant/server';

export default handlerWithAssistantClient<LinesApiReturnType>({
  async GET(req, res, { client, ok }) {
    return tryResult(req, res, async () => {
      return ok(
        await client.lines({
          authorities: ['MOR:Authority:MOR'],
        }),
      );
    });
  },
});
