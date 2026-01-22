import { Page } from 'k6/browser';
import Conf from '../conf/conf.ts';
/* @ts-ignore */
import file from 'k6/x/file';
import { sleep } from 'k6';

const logFile = 'logs/log.log';
const errorLogFile = 'logs/errors.log';
const requestsLogFile = 'logs/requests.log';

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

// Registers a handler that logs all responses received by the page
export const attachRequestLogger = (page: Page) => {
  // Only log one of the users during perf test with more users
  if (__VU === 1) {
    page.on('response', async (request) => {
      if (request.url().includes(`${Conf.host}/api/`)) {
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
