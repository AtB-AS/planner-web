import { Page } from 'k6/browser';
import Conf from '../conf/conf.ts';
/* @ts-ignore */
import file from 'k6/x/file';

const logFile = 'screenshots/sample-output.txt';
const errorLogFile = 'screenshots/sample-output-error.txt';

export const screenshot = async (page: Page, label: string) => {
  if (!Conf.isPerformanceTest) {
    await page.screenshot({ path: `screenshots/${label}.png` });
  }
};

export const log = (label: string) => {
  file.appendString(logFile, `${label}\n`);
};

export const errorLog = (label: string) => {
  file.appendString(errorLogFile, `${label}\n`);
};
