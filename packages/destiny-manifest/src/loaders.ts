import type { Manifest, ManifestDefinition } from "./types";

export const createLoader = () => {
  const builder = <Loaders extends Record<string, (row: any) => any>>(
    loaders: Loaders
  ) => {
    return {
      loaders,
      add: <K extends ManifestDefinition, RR extends { hash: string }>(
        name: K,
        loader: (row: Manifest[K]) => RR
      ) => {
        const newLoaders = {
          ...loaders,
          [name]: loader,
        } as Loaders & {
          [P in K]: (row: Manifest[K]) => RR;
        };

        return {
          add: builder(newLoaders).add,
          loaders: newLoaders,
        };
      },
    };
  };
  return builder({});
};
