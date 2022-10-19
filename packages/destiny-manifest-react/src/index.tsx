import React, { useCallback, useEffect } from "react";
export type {
  ProcessedTypes,
  ProcessedType,
  inferDomains,
  Language,
  Loader,
} from "@dswistowski/destiny-manifest";
export { createLoader, allLanguages } from "@dswistowski/destiny-manifest";

import {
  createBungieClient,
  createManifest as createBaseManifest,
  Database,
  inMemoryDBFactory,
  Language,
  Loader,
  ProcessedTypes,
  State,
} from "@dswistowski/destiny-manifest";
import { ManifestConfig } from "@dswistowski/destiny-manifest";
import { indexedDBFactory } from "@dswistowski/destiny-manifest/database";

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

const createManifest = <L extends Loader>(config: ManifestConfig<L>) => {
  type Processors = L["loaders"];
  type ProcessedType<T extends keyof Processors> = Processors[T] extends (
    ...args: any
  ) => infer R
    ? R & { hash: string }
    : never;

  const useDefinition = <T extends keyof Processors>(
    definition: T,
    key: string
  ) => {
    const getter = useCallback(
      () => manifest.get(definition, key),
      [definition, key]
    );

    return useAsyncLoader(getter);
  };

  const useDefinitions = <T extends keyof Processors>(
    definition: T,
    predicate: (item: ProcessedType<T>) => boolean
  ) => {
    const getter = useCallback(
      () => manifest.findMany(definition as unknown as never, predicate),
      [definition, predicate]
    );
    return useAsyncLoader(getter);
  };

  type GeneratedSingleHooks<Type extends Processors> = {
    [Property in keyof Processors as `use${string & Property}`]: (
      key: string
    ) => {
      data: ProcessedType<Property> | undefined;
      loading: boolean;
      error: Error | undefined;
    };
  };

  type GeneratedMultiHooks<Type extends Processors> = {
    [Property in keyof Processors as `use${string & Property}s`]: (
      predicate: (item: ProcessedType<Property>) => boolean
    ) => {
      data: ProcessedType<Property>[] | undefined;
      loading: boolean;
      error: Error | undefined;
    };
  };

  const singleHooks = Object.fromEntries(
    Object.entries(config.loader.loaders).map(([key, value]) => [
      `use${key}`,
      useDefinition.bind(null, key as any),
    ])
  ) as GeneratedSingleHooks<Processors>;

  const multiHooks = Object.fromEntries(
    Object.entries(config.loader.loaders).map(([key, value]) => [
      `use${key}s`,
      useDefinitions.bind(null, key as any),
    ])
  ) as GeneratedMultiHooks<Processors>;

  const manifest = createBaseManifest(config);

  const makeHookFromSelector = <T,>(selector: (state: State) => T) => {
    return (): T => {
      const [slice, setSlice] = React.useState<T>(
        selector(manifest.store.getState())
      );
      useEffect(() => {
        console.log("useEffect 1");
        return manifest.store.subscribe(() => {
          setSlice(selector(manifest.store.getState()));
        });
      }, [selector]);
      return slice;
    };
  };

  return {
    ...manifest,
    useDefinition,
    useDefinitions,
    ...singleHooks,
    ...multiHooks,
    useReady: makeHookFromSelector((state: State) => state.isReady),
  };
};

type PromiseResult<P> = P extends (...args: any[]) => Promise<infer R>
  ? R
  : never;

const useAsyncLoader = <
  T extends (...args: any[]) => Promise<any>,
  R extends PromiseResult<T>
>(
  future: T
) => {
  const [data, setData] = React.useState<R>();
  const [error, setError] = React.useState<Error>();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    console.log("useEffect 2", future);
    future()
      .then((data) => {
        if (!cancelled) setData(data);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [future]);

  return { data: data as R | undefined, loading, error };
};
