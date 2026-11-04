import bunyan from 'bunyan';
import { inspect } from 'node:util';

// Next unmaps `err.stack`; `util.inspect` gives source-mapped frames.
// https://github.com/vercel/next.js/issues/74646
const errSerializer = (err: unknown) => {
  if (!(err instanceof Error)) return err;
  let stack: string;
  try {
    stack = inspect(err, { colors: false, depth: 4 });
  } catch {
    stack = err.stack ?? String(err);
  }
  return {
    name: err.name,
    message: err.message,
    code: (err as { code?: unknown }).code,
    stack,
  };
};

export const logger = bunyan.createLogger({
  name: 'planner-web',
  streams: [{ stream: process.stdout, level: 'info' }],
  serializers: {
    req: (req: Request) => {
      return {
        method: req.method,
        url: req.url,
        headers: {
          ...req.headers,
          cookie: null,
        },
      };
    },
    res: bunyan.stdSerializers.res,
    upstream: (up: Response) => {
      return {
        statusCode: up.status,
        url: up.url,
        statusText: up.statusText,
      };
    },
    err: errSerializer,
  },
});
