import { Database } from "./type";
import { murmurhash3_32_gc } from "./hash";

const VERSIONS_TABLE = "versions";

async function makeDb<K extends string>(
  name: string,
  version: number,
  tables: K[]
) {
  console.debug("make db", version, tables);
  return await new Promise<IDBDatabase>((resolve, reject) => {
    const dbOpenRequest = indexedDB.open(name, version);
    dbOpenRequest.onupgradeneeded = (event) => {
      console.debug("db upgrade needed");
      const db = dbOpenRequest.result;
      tables.map((name) => {
        db.createObjectStore(name, { keyPath: "hash" });
      });
      db.createObjectStore(VERSIONS_TABLE, { keyPath: "name" });
    };

    dbOpenRequest.onerror = (e) => {
      console.debug("db open error", dbOpenRequest.error);
      reject(dbOpenRequest.error);
    };
    dbOpenRequest.onsuccess = () => {
      resolve(dbOpenRequest.result);
    };
    dbOpenRequest.onblocked = () => {
      console.error("db blocked");
    };
  });
}

function generateHashes<D>(
  processors: Partial<{ [key in keyof D]: (data: any) => D[keyof D] }>,
  version: string,
  language: string,
  hashSeed: number
) {
  const entries = Object.entries(processors);
  const hashedEntries = Object.fromEntries(
    entries.map(([key, value]) => [
      key,
      murmurhash3_32_gc(`${version}${value}${language}`, hashSeed),
    ])
  );
  return hashedEntries;
}

async function deleteDatabase(name: string) {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export const indexedDBFactory = <D>(
  processors: Partial<{
    [key in keyof D]: (data: any) => D[keyof D];
  }>,
  name: string,
  language: string,
  hashSeed: number = 0x2f1a7f2d
): Database<D> => {
  let db: IDBDatabase | undefined = undefined;
  let alreadyOpening = false;
  const toRefresh = new Set<string>();

  function waitForDb(wait = 100) {
    console.debug("waiting for db");
    return new Promise<IDBDatabase>((resolve) => {
      const interval = setInterval(() => {
        if (db) {
          clearInterval(interval);
          resolve(db);
        }
      }, wait);
    });
  }

  const areFlatSetsEqual = <T>(a: Set<T>, b: Set<T>) =>
    a.size === b.size && [...a].every((value) => b.has(value));

  const database: Database<D> = {
    close: async () => {
      await db?.close();
    },
    initialize: async (datasets, version) => {
      console.debug("initialize", datasets, version);
      if (db) return async () => {};
      if (alreadyOpening) {
        await waitForDb();
        return async () => {};
      }
      alreadyOpening = true;
      console.debug("real initialize");
      const tables = datasets.map((d) => `${String(d)}`);
      db = await makeDb(name, 1, tables);

      const hashes = generateHashes(processors, version, language, hashSeed);
      let versions: {
        [k: string]: number;
      } = {};
      try {
        versions = Object.fromEntries(
          (
            (await getAll(db, VERSIONS_TABLE)) as {
              name: keyof D;
              hash: number;
            }[]
          ).map(({ name, hash }) => [name, hash])
        );
      } catch (e) {}

      if (
        !areFlatSetsEqual(
          new Set([...tables, VERSIONS_TABLE]),
          new Set(Object.values(db.objectStoreNames))
        )
      ) {
        console.log("tables don't match, clearing db");
        db.close();
        await deleteDatabase(name);
        db = await makeDb(name, 1, tables);
        db.transaction(VERSIONS_TABLE, "readwrite")
          .objectStore(VERSIONS_TABLE)
          .clear();
      }
      
      Object.entries(hashes)
        .filter(([name, hash]) => versions[name] !== hash)
        .map(([name]) => name)
        .filter((name) => db?.objectStoreNames.contains(name))
        .forEach((name) => toRefresh.add(name));
      return async () => {
        await put(
          db!,
          VERSIONS_TABLE,
          Object.entries(hashes).map(([k, v]) => ({ name: k, hash: v }))
        );
      };

    },
    processed: (dataset) => !toRefresh.has(String(dataset)),
    get: async (dataset, key) => {
      const all = await get<D[keyof D] | undefined>(db!, `${String(dataset)}`, [
        key,
      ]);
      return all[0];
    },
    put: async (dataset, hash, row) =>
      put(db!, `${String(dataset)}`, [
        {
          ...row,
          hash,
        },
      ]),
    putMany: async (dataset: keyof D, data: [string, D[keyof D]][]) =>
      put(
        db!,
        `${String(dataset)}`,
        data.map(([hash, d]) => ({ ...d, hash }))
      ),
    getMany: async (dataset, predicate) => {
      if (predicate === undefined) {
        return await getAll(db!, `${String(dataset)}`);
      } else {
        const keys = await getKeys(db!, `${String(dataset)}`, predicate);
        return await get(db!, `${String(dataset)}`, keys);
      }
    },
    findMany: async (
      dataset: keyof D,
      predicate: (item: D[keyof D]) => boolean
    ): Promise<D[keyof D][]> => {
      return await getFiltered(db!, `${String(dataset)}`, predicate);
    },
  };
  return database;
};

const getAll = async <R>(db: IDBDatabase, store: string) => {
  return new Promise<R[]>((resolve, reject) => {
    console.debug("getAll", store);
    let resolved = false;
    const transaction = db.transaction([store], "readonly");
    const objectStore = transaction.objectStore(store);
    const request = objectStore.getAll();

    setTimeout(() => {
      if (!resolved) {
        console.debug("getAll timed out");
        reject("getAll timed out");
      }
    }, 5000);

    transaction.oncomplete = () => {
      resolved = true;
      resolve(request.result);
    };
    transaction.onerror = reject;
  });
};

const getFiltered = async <R>(
  db: IDBDatabase,
  store: string,
  predicate: (row: R) => boolean
) => {
  const found: R[] = [];
  return new Promise<R[]>((resolve, reject) => {
    const transaction = db.transaction([store], "readonly");
    const objectStore = transaction.objectStore(store);
    const request = objectStore.openCursor();
    request.onsuccess = (event) => {
      const cursor = request.result;
      if (cursor) {
        if (predicate(cursor.value)) {
          found.push(cursor.value);
        }
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(found);
    transaction.onerror = reject;
  });
};

const getKeys = async <R>(
  db: IDBDatabase,
  store: string,
  predicate: (key: string) => boolean
) => {
  return new Promise<string[]>((resolve, reject) => {
    const transaction = db.transaction([store], "readonly");
    const objectStore = transaction.objectStore(store);
    const keys = [] as string[];
    const request = objectStore.openKeyCursor();
    request.onsuccess = (event) => {
      const cursor = request.result;
      if (cursor) {
        const key = cursor.key as string;
        if (predicate(key)) {
          keys.push(key);
        }
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(keys);
    transaction.onerror = reject;
  });
};

const get = async <R>(db: IDBDatabase, store: string, keys: string[]) => {
  return new Promise<R[]>((resolve, reject) => {
    const transaction = db.transaction([store], "readonly");
    const objectStore = transaction.objectStore(store);
    const results = [] as R[];
    keys.forEach((key) => {
      const request = objectStore.get(key);
      request.onsuccess = () => {
        results.push(request.result);
      };
      request.onerror = reject;
    });
    transaction.oncomplete = () => resolve(results);
    transaction.onerror = reject;
  });
};

const put = async <T>(db: IDBDatabase, store: string, data: T[]) => {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([store], "readwrite", {
      durability: "relaxed",
    });
    const objectStore = transaction.objectStore(store);
    data.forEach((datum) => {
      objectStore.put(datum).onerror = reject;
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = reject;
  });
};
