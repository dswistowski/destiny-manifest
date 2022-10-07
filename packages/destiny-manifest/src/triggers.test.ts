import { expect, test, describe } from "vitest";
import { makeStore } from "./store";
import { makeAction } from "./triggers";

describe("triggers", () => {
  test("can generate aciton", () => {
    const state = { foo: "bar", lorem: 42 };
    const store = makeStore(state);
    const onFooEqualBaz = makeAction<typeof store, typeof state>(
      (state) => state.foo === "baz"
    );
    let count = 0;
    onFooEqualBaz(store)(() => {
      count++;
    });
    expect(count).toBe(0);
    store.mutate((state) => ({ ...state, foo: "baz" }));
    expect(count).toBe(1);
    store.mutate((state) => ({ ...state, foo: "bar" }));
    expect(count).toBe(1);
  });
});
