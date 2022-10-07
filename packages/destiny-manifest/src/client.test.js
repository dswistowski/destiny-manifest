import createFetchMock from "vitest-fetch-mock";

import { beforeEach, expect, test, describe, vi } from "vitest";
import { createBungieClient } from "./client";

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

describe("client", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  const client = createBungieClient("the-api-key");

  test("client should call bungie api with api key", async () => {
    await client("/Destiny2/Manifest/");
    expect(fetch.mock.calls[0][0]).toEqual(
      "https://www.bungie.net/Destiny2/Manifest/"
    );
    expect(fetch.mock.calls[0][1].headers["X-API-Key"]).to.be.equal(
      "the-api-key"
    );
  });

  test("client should fetch api definition without spefing headers", async () => {
    await client(
      "/common/destiny2_content/json/en/DestinyInventoryBucketDefinition-f46d7245-56b3-4834-a81f-9feef90658cc.json"
    );
    expect(fetch.mock.calls[0][1]).to.be.undefined;
  });
});
