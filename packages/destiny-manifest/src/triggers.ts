import { ManifestStore, State } from "./types";
import { Store } from "./store";

type Action<ST extends Store<S>, S> = (
  store: ST
) => (action: (state: S) => unknown) => unknown;

export const makeAction = <ST extends Store<S>, S>(
  predicate: (state: S) => boolean
): Action<ST, S> => {
  return (store: ST) => (action: (state: S) => unknown) => {
    const unsubscribe = store.subscribe((state) => {
      if (predicate(state)) {
        unsubscribe();
        action(state);
      }
    });
  };
};

export const onSpecLoaded = makeAction<ManifestStore, State>(
  (state) => state.spec !== undefined
);
export const onDBInitialized = makeAction<ManifestStore, State>(
  (state) => state.dbInitialized
);
export const onReady = makeAction<ManifestStore, State>(
  (state) => state.isReady
);
export const onError = makeAction<ManifestStore, State>(
  (state) => state.error !== undefined
);
