export type Database<D> = {
  initialize: (datasets: (keyof D)[], version: string) => Promise<() => void>;
  processed: (dataset: keyof D) => boolean;
  put: (dataset: keyof D, key: string, data: D[keyof D]) => Promise<void>;
  get: (dataset: keyof D, key: string) => Promise<D[keyof D] | undefined>;
  putMany: (dataset: keyof D, data: [string, D[keyof D]][]) => Promise<void>;
  getMany: (
    dataset: keyof D,
    predicate?: (key: string) => boolean
  ) => Promise<D[keyof D][]>;
  findMany: (
    dataset: keyof D,
    predicate: (item: D[keyof D]) => boolean
  ) => Promise<D[keyof D][]>;

  close: () => Promise<void>;
};
