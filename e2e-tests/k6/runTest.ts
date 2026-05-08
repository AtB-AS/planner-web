import { Metrics } from './measurements/metrics.ts';
import Conf from './conf/conf.ts';
import { Options } from 'k6/options';
// @ts-ignore
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';
import { getMetrics, metricsLog } from './utils/utils.ts';
import { LoggedMetric } from './types';
import { createSlackMessage } from './utils/slackMessage.ts';

// Options
export const options: Options = Conf.options;

// Trends
const metrics = new Metrics();

//Before the simulation starts
export function setup() {
  console.log('---- Setup ----');
  console.log(`Environment: ${Conf.host}`);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async function () {
  await Conf.usecase(metrics);
}

export function handleSummary(data: any) {

  const m = data.metrics;

  const metricsJson: LoggedMetric[] = [
    getMetrics('LCP', 'WEB_VITAL', m?.browser_web_vital_lcp),
    getMetrics('FCP', 'WEB_VITAL', m?.browser_web_vital_fcp),
    getMetrics('TTFB', 'WEB_VITAL', m?.browser_web_vital_ttfb),
    getMetrics('CLS', 'WEB_VITAL', m?.browser_web_vital_cls),
    getMetrics('INP', 'WEB_VITAL', m?.browser_web_vital_inp),
    getMetrics('Assistant first result', 'CUSTOM', m?.metric_assistant_firstResult),
    getMetrics('Assistant last result', 'CUSTOM', m?.metric_assistant_lastResult),
    getMetrics('Assistant summary open', 'CUSTOM', m?.metric_assistant_summary_open),
    getMetrics('Assistant details open', 'CUSTOM', m?.metric_assistant_details_open),
    getMetrics('Assistant region first result', 'CUSTOM', m?.metric_assistant_region_firstResult),
    getMetrics('Assistant region last result', 'CUSTOM', m?.metric_assistant_region_lastResult),
    getMetrics('Assistant region summary open', 'CUSTOM', m?.metric_assistant_region_summary_open),
    getMetrics('Assistant region details open', 'CUSTOM', m?.metric_assistant_region_details_open),
    getMetrics('Departures show', 'CUSTOM', m?.metric_departures_show),
    getMetrics('Departures details open', 'CUSTOM', m?.metric_departures_details_open),
  ];
  metricsLog(metricsJson);
  createSlackMessage(metricsJson, m?.browser_http_req_failed?.values?.rate);

  //return {}
  return { stdout: textSummary(data, { indent: ' ', enableColors: true }) };
}
