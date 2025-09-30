import 'dotenv/config';

/**
 * The base URL for the API, used in development mode. Use `getServiceUrl` to
 * connect directly to service in production.
 */
const API_BASE_URL: string | undefined = process.env.API_BASE_URL;

export function getEnv() {
  return process.env['NODE_ENV'] === 'production' ? 'prod' : 'dev';
}

/**
 * Return a URL to the given service. `serviceKey` should be uppercased.
 * These values are only available at runtime, not at build time
 */
export const getServiceUrl = (
  prefix: string,
  serviceKey: string,
  required: boolean = false,
): string => {
  if (getEnv() === 'dev') return API_BASE_URL ?? '';

  const host = getServiceHost(serviceKey);
  const port = getServicePort(serviceKey);

  if (host === '' || port === '') {
    if (required) {
      console.error(
        `failed to read environment variables for required service: ${serviceKey}`,
      );
      process.exit(-1);
    } else {
      return '';
    }
  }

  return `${prefix}${host}:${port}`;
};

const getServiceHost = (serviceKey: string): string => {
  return (
    process.env[`${serviceKey}_SERVICE_SERVICE_HOST`] ||
    process.env[`${serviceKey}_SERVICE_HOST`] ||
    ''
  );
};

const getServicePort = (serviceKey: string): string => {
  return (
    process.env[`${serviceKey}_SERVICE_SERVICE_PORT`] ||
    process.env[`${serviceKey}_SERVICE_PORT`] ||
    ''
  );
};

export const BFFURL: string = getServiceUrl('http://', 'BFF', false) + '/bff';
export const SALESURL: string =
  getServiceUrl('http://', 'SALES', false) + '/sales';
