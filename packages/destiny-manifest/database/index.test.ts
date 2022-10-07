import { expect, test, describe, afterEach } from "vitest";
import { indexedDBFactory } from "./indexedDB";
import { inMemoryDBFactory } from "./memory";
import "fake-indexeddb/auto";

describe.each([
  () =>
    indexedDBFactory<{ foo: {}; bar: {} }>(
      { foo: (r) => r, bar: (r) => r },
      "the-db",
      "en",
      42
    ),
  inMemoryDBFactory,
])("databases", (dbFactory) => {
  afterEach(async () => {
    indexedDB = new IDBFactory();
  });
  test("should be able to initialize", async () => {
    const db = dbFactory();
    const close = await db.initialize(["foo", "bar"], "1.0.0");
    await close();
  });

  test("should be able to put and get", async () => {
    const db = dbFactory();
    const commit = await db.initialize(["foo", "bar"], "1.0.0");
    await db.put("foo", "key", { foo: "foo" });
    const result = await db.get("foo", "key");
    expect(result).to.be.deep.equal({ foo: "foo", hash: "key" });
  });

  test("should be able to put many and get many", async () => {
    const db = dbFactory();
    const commit = await db.initialize(["foo", "bar"], "1.0.0");
    await db.putMany("foo", [
      ["key1", { foo: "foo" }],
      ["key2", { foo: "bar" }],
    ]);
    const result = await db.getMany("foo", (key) => key === "key1");
    expect(result).to.be.deep.equal([{ foo: "foo", hash: "key1" }]);
  });

  test("should be able to find many", async () => {
    const db = dbFactory();
    const close = await db.initialize(["foo", "bar"], "1.0.0");
    await db.putMany("foo", [
      ["key1", { foo: "foo" }],
      ["key2", { foo: "bar" }],
    ]);
    const result = await db.findMany(
      "foo",
      (item) => (item as { foo: string }).foo === "foo"
    );
    expect(result).to.be.deep.equal([{ foo: "foo", hash: "key1" }]);
  });
});
