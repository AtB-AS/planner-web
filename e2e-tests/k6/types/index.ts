export type EnvType = {
  environments: {
    [environment: string]: {
      host: string;
    };
  };
};

export type FromLocationType = {
  name: string;
  quay: string;
};

export type ToLocationType = {
  name: string;
  quay?: string;
};

export type FromAddressType = {
  name: string;
  nearbyStopPlace: string;
};

export type LoggedMetric = {
  name: string,
  type: 'WEB_VITAL' | 'CUSTOM',
  values: {
    avg: number,
    p75: number | null,
    p95: number | null,
    unit: string | null,
    count: number
  } | null
}

export interface SummaryMetric {
  type: string;
  contains: string;
  values: {
    count?: number;
    min?: number;
    max?: number;
    avg?: number;
    med?: number;
    p90?: number;
    p95?: number;
  };
  thresholds: Record<string, boolean>;
}

export interface SummaryData {
  metrics: Record<string, SummaryMetric>;
  root_group: object;
  state: string;
}

type SlackTextElement = {
  type: 'text';
  text: string;
  style?: { bold: boolean };
};

export type SlackRichText = {
  type: 'rich_text';
  elements: [{ type: 'rich_text_section'; elements: SlackTextElement[] }];
};

type SlackSectionBlock = {
  type: 'section';
  text: { type: 'mrkdwn'; text: string };
};

type SlackTableBlock = {
  type: 'table';
  rows: SlackRichText[][];
};

export type SlackMessage = {
  blocks: (SlackSectionBlock | SlackTableBlock)[];
};

