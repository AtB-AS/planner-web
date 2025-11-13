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
