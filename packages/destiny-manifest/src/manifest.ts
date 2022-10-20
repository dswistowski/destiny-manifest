
import type {
  LoaderParam,
  Language,
  Loader,
  ManifestDefinition,
  State,
} from "./types";
import type { BungieClient } from "./client";
import { makeStore } from "./store";
import { makeManifestSpec, Processor, ProcessedTypes } from "./types";
import { processJsonStream } from "./processJsonStream";
import { onDBInitialized, onReady, onSpecLoaded, onError } from "./triggers";
import { createBungieClient } from "./client";
import type { Database } from "../database";
import { indexedDBFactory, inMemoryDBFactory } from "../database";

export type ManifestConfig<L extends Loader> = {
  loader: L;
  bungieClient: BungieClient;
  language?: Language;
  database: Database<ProcessedTypes<L>>;
};

const loadManifestSpec = async (
  client: BungieClient,
  language: Language,
  specs: ManifestDefinition[]
): Promise<Partial<State>> => {
  try {
    const response = await client("/platform/Destiny2/Manifest/");
    const manifest = await response.json();

    return {
      spec: makeManifestSpec(manifest.Response, language, specs),
    };
  } catch (error) {
    return {
      error: `Couldn't load manifest spec ${error}`,
    };
  }
};

export const createDefaultManifest = <L extends Loader>({
  loader,
  apiKey,
  language,
  dbName,
}: {
  loader: L;
  apiKey: string;
  dbName?: string;
  language?: Language;
}) =>
  createManifest({
    loader,
    bungieClient: createBungieClient(apiKey),
    database: indexedDBFactory(
      loader.loaders,
      dbName || "destiny-manifest",
      language || "en"
    ) as Database<ProcessedTypes<L>>,
    language,
  });

export const createVolatileManifest = <L extends Loader>({
  loader,
  apiKey,
  language,
}: {
  loader: L;
  apiKey: string;
  language?: Language;
}) =>
  createManifest({
    loader,
    bungieClient: createBungieClient(apiKey),
    database: inMemoryDBFactory() as Database<ProcessedTypes<L>>,
    language,
  });

export const createManifest = <L extends Loader>(config: ManifestConfig<L>) => {
  const store = makeStore<State>({
    isReady: false,
    dbInitialized: false,
    error: undefined,
    spec: undefined,
  });

  const triggers = {
    onReady: onReady(store),
    onSpecLoaded: onSpecLoaded(store),
    onDBInitialized: onDBInitialized(store),
    onError: onError(store),
  };

  const language = config.language || "en";
  const database = config.database || inMemoryDBFactory();
  type Processors = L["loaders"];
  type ProcessedType<T extends keyof Processors> = Processors[T] extends (
    ...args: any
  ) => infer R
    ? R & { hash: string }
    : never;
  const processors: Processors = config.loader.loaders;
  const allSpecs = Object.keys(processors) as (keyof Processors)[];

  triggers.onSpecLoaded((state) => {
    return database
      .initialize(allSpecs, state.spec?.version || "")
      .then(async (postInitialize) => {
        triggers.onReady(postInitialize);
        store.mutate((state) => ({ ...state, dbInitialized: true }));
      });
  });

  triggers.onDBInitialized(async (state) => {
    for (const spec of allSpecs) {
      if (database.processed(spec)) continue;
      console.debug(`Processing ${String(spec)}`);
      const process = processors[spec] as Processor<L, typeof spec>;
      const path = state?.spec?.worldContent[spec as ManifestDefinition];
      if (!path) continue;

      const response = await config.bungieClient(path);
      const body = response.body;
      if (!body) {
        throw new Error(`Failed to fetch ${String(spec)}`);
      }
      const bucket = []
      const objects = (await response.json()) as Record<string, LoaderParam<L, typeof spec>>;
      config.database.putMany(spec, (Object.values(objects).map((record) => process(record))
        .map((record) => [`${(record as ProcessedType<typeof spec>).hash}`, record])))
        
    }
    store.mutate((state) => ({ ...state, isReady: true }));
  });
  loadManifestSpec(
    config.bungieClient,
    language,
    allSpecs as ManifestDefinition[]
  ).then((result) => {
    store.mutate((state) => {
      return {
        ...state,
        ...result,
      };
    });
  });

  let isReady = false;
  triggers.onReady(() => {
    isReady = true;
  });
  const readyDb = async () => {
    if (isReady) {
      return database;
    }
    return new Promise<typeof config.database>((resolve) => {
      triggers.onReady(() => {
        resolve(database);
      });
    });
  };

  return {
    store,
    get: async <T extends keyof Processors>(definition: T, key: string) => {
      return (await (await readyDb()).get(definition, key)) as
        | ProcessedType<T>
        | undefined;
    },
    getMany: async <T extends keyof Processors>(
      definition: T,
      predicate?: (key: string) => boolean
    ) => {
      return (await (
        await readyDb()
      ).getMany(definition, predicate)) as ProcessedType<T>[];
    },
    findMany: async <T extends keyof Processors>(
      definition: T,
      predicate: (item: ProcessedType<T>) => boolean
    ) => {
      return (await (
        await readyDb()
      ).findMany(
        definition,
        predicate as (row: any) => any
      )) as ProcessedType<T>[];
    },
    triggers,
  };
};
