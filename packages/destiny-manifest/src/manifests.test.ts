import { expect, test, describe, vi, afterEach } from "vitest";
import { createManifest, createVolatileManifest } from "./manifest";
import { createLoader } from "./loaders";
import { inMemoryDBFactory } from "../database";
import type { ClientResponse } from "./client";
import { ManifestResponse } from "./types";

const MANIFEST_RESPONSE = {
  Response: {
    version: "1.0.0",
    jsonWorldComponentContentPaths: {
      en: {
        DestinyPresentationNodeDefinition: "DestinyActivityDefinition.json",
        DestinyInventoryItemDefinition: "DestinyInventoryItemDefinition.json",
      },
    },
  },
} as unknown as ManifestResponse;
const definitionContent = (path: string) =>
  JSON.stringify({
    "42": { lorem: "ipsum-foo", path },
    "44": { lorem: "ipsum-bar", path },
  });

const fakeBungieClient = async (path: string): Promise<ClientResponse> => {
  if (path.endsWith(".json")) {
    return {
      body: {
        getReader: () => {
          let finished = false;
          return {
            read() {
              if (finished) {
                return { done: true };
              }
              finished = true;
              return {
                done: false,
                value: new TextEncoder().encode(definitionContent(path)),
              };
            },
          };
        },
      } as any,
      json: {} as ClientResponse["json"],
    };
  }
  return {
    body: {} as ClientResponse["body"],
    json: async () => {
      return MANIFEST_RESPONSE;
    },
  };
};

describe("manifests", () => {
  const loader = createLoader()
    .add("DestinyPresentationNodeDefinition", (r) => r)
    .add("DestinyInventoryItemDefinition", (r) => r);

  test("createVolatileManifest should return store", () => {
    const manifest = createVolatileManifest({
      loader,
      language: "en",
      apiKey: "123",
    });
    expect(manifest).to.have.property("store");
  });

  test("manifest should expose get and find", async () => {
    const manifest = await new Promise<ReturnType<typeof createManifest>>(
      (resolve, reject) => {
        const manifest = createManifest({
          loader,
          language: "en",
          bungieClient: fakeBungieClient,
          database: inMemoryDBFactory() as any,
        });

        manifest.triggers.onDBInitialized((state) => {
          console.log("DB initialized", state);
        });
        manifest.triggers.onReady(() => {
          resolve(manifest);
        });
        manifest.triggers.onError((e) => {
          reject(e.error);
        });
      }
    );
    expect(
      await manifest.getMany(
        "DestinyPresentationNodeDefinition" as never,
        () => true
      )
    ).toMatchObject([
      {
        lorem: "ipsum-foo",
        path: "DestinyActivityDefinition.json",
        hash: "42",
      },
      {
        lorem: "ipsum-bar",
        path: "DestinyActivityDefinition.json",
        hash: "44",
      },
    ]);
    expect(
      await manifest.get("DestinyPresentationNodeDefinition" as never, "42")
    ).toMatchObject({
      lorem: "ipsum-foo",
      path: "DestinyActivityDefinition.json",
      hash: "42",
    });

    expect(
      await manifest.findMany(
        "DestinyPresentationNodeDefinition" as never,
        (r) => (r as any).lorem.endsWith("-bar")
      )
    ).toMatchObject([
      {
        lorem: "ipsum-bar",
        path: "DestinyActivityDefinition.json",
        hash: "44",
      },
    ]);
  });
});
