import { Database } from "./type";

export const inMemoryDBFactory = <D>(): Database<D> => {
  type DS = keyof D;
  let memory = {} as Record<DS, Map<string, D[DS]>>;

  const db: Database<D> = {
    close: async () => {},
    processed: () => false,
    initialize: async (datasets) => {
      datasets.forEach((dataset) => {
        memory[dataset] = new Map();
      });
      return () => {};
    },
    get: async (dataset, key) => {
      const data = memory[dataset].get(key);
      return data && { ...data, hash: key };
    },
    put: async (dataset, key, data) => {
      memory[dataset].set(key, data);
    },
    putMany: async (dataset: keyof D, data: [string, D[keyof D]][]) => {
      data.forEach(([key, value]) => {
        db.put(dataset, key, value);
      });
    },
    getMany: async (dataset, predicate) => {
      return Promise.all(
        [...memory[dataset].keys()]
          .filter(predicate || (() => true))
          .map((key) => db.get(dataset, key) as D[DS])
      );
    },
    findMany: async (
      dataset: keyof D,
      predicate: (item: D[keyof D]) => boolean
    ): Promise<D[keyof D][]> => {
      return [...memory[dataset].entries()]
        .filter(([_, v]) => predicate(v))
        .map(([k, v]) => v && { ...v, hash: k });
    },
  };
  return db;
};
