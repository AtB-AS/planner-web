import { Page } from 'k6/browser';
import Conf from '../conf/conf.ts';
/* @ts-ignore */
import file from 'k6/x/file';
import { sleep } from 'k6';
import { LoggedMetric } from '../types';
/* @ts-ignore */
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

const logFile = 'logs/log.log';
const errorLogFile = 'logs/errors.log';
const requestsLogFile = 'logs/requests.log';
const metricsLogFile = 'logs/metrics.json';

export const screenshot = async (page: Page, label: string) => {
  if (!Conf.isPerformanceTest) {
    sleep(1);
    await page.screenshot({ path: `screenshots/${label}.png` });
  }
};

export const log = (label: string) => {
  file.appendString(logFile, `${label}\n`);
};

export const errorLog = (label: string) => {
  file.appendString(errorLogFile, `${label}\n`);
};

export const requestLog = (label: string) => {
  file.appendString(requestsLogFile, `${label}\n`);
};

// Calculate wanted metrics from a metric object
export const getMetrics = (
  label: string,
  type: 'WEB_VITAL' | 'CUSTOM',
  metric: any,
): LoggedMetric => {
  if (!metric) return { name: label, type: type, values: null };
  const isTime = metric.contains === 'time';
  const divisor = isTime ? 1000 : 1;
  const suffix = isTime ? 's' : '';
  const val = (v: number) => (v / divisor).toFixed(3);
  const avg = +val(metric.values.avg);
  const p75 =
    metric.values['p(75)'] != null ? +val(metric.values['p(75)']) : null;
  const p95 =
    metric.values['p(95)'] != null ? +val(metric.values['p(95)']) : null;
  const count = metric.values.count;

  return {
    name: label,
    type,
    values: { avg, p75, p95, unit: suffix || null, count },
  };
};

// Write all logged metrics to file
export const metricsLog = (metrics: LoggedMetric[]) => {
  file.writeString(metricsLogFile, JSON.stringify(metrics));
};

// Registers a handler that logs all responses received by the page
export const attachRequestLogger = (page: Page) => {
  // Only log one of the users during perf test with more users
  if (__VU === 1) {
    page.on('response', async (request) => {
      if (
        request.url().includes(`${Conf.host}`) &&
        request.url().includes(`/api/`)
      ) {
        let delay = Math.round(
          request.request().timing().responseStart,
        ).toString();
        while (delay.length < 5) {
          delay = ' ' + delay;
        }
        requestLog(
          `[DELAY] ${delay}\t[REQUEST] ${request.request().method()}\t${request.status()}\t${request.url()}`,
        );
      }
    });
  }
};

export async function testIdExists(
  page: Page,
  testId: string,
): Promise<boolean> {
  return (await page.locator(`[data-testid="${testId}"]`).count()) > 0;
}

export function functName(fn: Function) {
  console.log(`** Test case: ${fn.name}`);
  return fn.name;
}

export const randomSleep = (min = 2, max = 10) => {
  if (!Conf.skipSleep) sleep(randomIntBetween(min, max));
};
