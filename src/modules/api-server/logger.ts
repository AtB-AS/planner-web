import bunyan from 'bunyan';

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
    err: bunyan.stdSerializers.err,
  },
});
