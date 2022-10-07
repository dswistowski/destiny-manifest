import { expect, test, describe } from "vitest";
import { makeStore } from "./store";

describe("store", function () {
  test("store can mutate value", async function () {
    const store = makeStore({ foo: "bar", lorem: 42 });
    store.mutate((state) => ({ ...state, foo: "baz" }));
    expect(store.getState()).toMatchObject({ foo: "baz", lorem: 42 });
  });

  test("store can subscribe", async function () {
    let baz = undefined;
    const store = makeStore({ foo: "bar", lorem: 42 });
    store.subscribe((state) => {
      baz = state.foo;
    });
    expect(baz).toBe("bar");
    store.mutate((state) => ({ ...state, foo: "baz" }));
    expect(baz).toBe("baz");
  });

  test("store can unsubscribe", async function () {
    let baz = undefined;
    const store = makeStore({ foo: "bar", lorem: 42 });
    const unsubscribe = store.subscribe((state) => {
      baz = state.foo;
    });
    expect(baz).toBe("bar");
    store.mutate((state) => ({ ...state, foo: "baz" }));
    expect(baz).toBe("baz");
    unsubscribe();
    store.mutate((state) => ({ ...state, foo: "bar" }));
    expect(baz).toBe("baz");
  });
});
