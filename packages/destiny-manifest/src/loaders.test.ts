import { expect, test, describe } from "vitest";
import { createLoader } from "./loaders";

describe("loaders", () => {
  test("should allow to add definitions", () => {
    const loader = createLoader()
      .add("DestinyPresentationNodeDefinition", (row) => ({
        hash: row.hash,
        displayProperties: row.displayProperties,
      }))
      .add("DestinyInventoryItemDefinition", (r) => r);
    expect(loader.loaders).to.have.all.keys(
      "DestinyPresentationNodeDefinition",
      "DestinyInventoryItemDefinition"
    );
  });
});
