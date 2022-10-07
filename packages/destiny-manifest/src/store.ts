export const makeStore = <T>(initialState: T): Store<T> => {
  let state: T = initialState;
  const listeners = new Set<(state: T) => void>();
  return {
    getState: () => state,
    mutate: (mutation: (currentState: T) => T) => {
      state = mutation(state);
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (fn: (state: T) => void) => {
      listeners.add(fn);
      fn(state);
      return () => {
        listeners.delete(fn);
      };
    },
  };
};

export type Store<T> = {
  getState: () => T;
  mutate: (mutation: (currentState: T) => T) => void;
  subscribe: (fn: (state: T) => void) => () => void;
};
