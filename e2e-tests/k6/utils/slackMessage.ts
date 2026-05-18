import { LoggedMetric, SlackMessage, SlackRichText } from '../types';
/* @ts-ignore */
import file from 'k6/x/file';
import { webVitalLimits } from '../conf/webVitals.ts';
import Conf from '../conf/conf.ts';

const slackNotificationFile = 'logs/slack_notification.json';

const title = (errorRate: number | undefined) => {
  const rateStr = errorRate != null ? `${(errorRate * 100).toFixed(1)}%` : 'NA';
  return `*Measurements*\n*Host:* ${Conf.host}\n*Request error rate:* ${rateStr}\n(* needs improvement, poor values additionally in bold)`;
};

const cell = (text: string, bold = false): SlackRichText => ({
  type: 'rich_text',
  elements: [
    {
      type: 'rich_text_section',
      elements: [{ type: 'text', text, style: { bold } }],
    },
  ],
});

const fmtValWebVitalCheck = (
  name: string,
  v: number | null,
  unit: string | null,
): { text: string; bold: boolean } => {
  if (v == null) return { text: 'NA', bold: false };
  if (Object.keys(webVitalLimits).includes(name)) {
    const limits = webVitalLimits[name as keyof typeof webVitalLimits];
    if (v > limits.poor) return { text: `${v}${unit ?? ''} *`, bold: true };
    if (v > limits.good) return { text: `${v}${unit ?? ''} *`, bold: false };
  }
  return { text: `${v}${unit ?? ''}`, bold: false };
};

const fmtVal = (v: number | null, unit: string | null) =>
  v != null ? `${v}${unit ?? ''}` : 'NA';

export const createSlackMessage = (
  metrics: LoggedMetric[],
  errorRate: number | undefined,
) => {
  const headerRow = [
    cell('Metric', true),
    cell('avg', true),
    cell('p(75)', true),
    cell('p(95)', true),
    cell('count', true),
  ];

  const dataRows = metrics.map((m) => {
    const p75 = fmtValWebVitalCheck(
      m.name,
      m.values?.p75 ?? null,
      m.values?.unit ?? null,
    );
    return [
      cell(m.name),
      cell(fmtVal(m.values?.avg ?? null, m.values?.unit ?? null)),
      cell(p75.text, p75.bold),
      cell(fmtVal(m.values?.p95 ?? null, m.values?.unit ?? null)),
      cell(fmtVal(m.values?.count ?? null, null)),
    ];
  });

  const message: SlackMessage = {
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `${title(errorRate)}` },
      },
      { type: 'table', rows: [headerRow, ...dataRows] },
    ],
  };

  file.writeString(slackNotificationFile, JSON.stringify(message));
};
