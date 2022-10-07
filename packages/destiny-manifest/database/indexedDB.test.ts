import { expect, test, describe, afterEach } from "vitest";
import { indexedDBFactory } from "./indexedDB";
import "fake-indexeddb/auto";

const getTables = async (name: string, version = 1) =>
  new Promise<DOMStringList>((resolve, reject) => {
    const open_request = indexedDB.open(name, version);
    open_request.onsuccess = () => {
      const db = open_request.result;
      resolve(db.objectStoreNames);
      db.close();
    };
    open_request.onblocked = reject;
    open_request.onerror = reject;
  });
describe("indexedDB", () => {
  test("should drop db if tables changed ", async () => {
    const db1 = indexedDBFactory(
      { foo: (r) => r, bar: (r) => r },
      "the-db",
      "en",
      42
    );
    const finalize = await db1.initialize(["foo", "bar"], "1.0.0");
    finalize();
    expect(await getTables("the-db")).to.have.all.members([
      "foo",
      "bar",
      "versions",
    ]);

    (db1 as unknown as { close: () => void }).close();

    const db2 = indexedDBFactory(
      { foo: (r) => r, bar: (r) => r },
      "the-db",
      "en",
      42
    );

    const finalize2 = await db2.initialize(["foo"], "1.0.0");
    finalize2();

    expect(await getTables("the-db")).to.be.deep.equal(["foo", "versions"]);
  });
});
