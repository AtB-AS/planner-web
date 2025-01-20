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
