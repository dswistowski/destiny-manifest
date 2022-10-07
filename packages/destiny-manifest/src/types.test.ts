import { expect, test, describe } from "vitest";
import {
  Language,
  makeManifestSpec,
  ManifestDefinition,
  ManifestResponse,
} from "./types";

describe("makeManifestSpec", () => {
  test("cam process spec", () => {
    const response: ManifestResponse = {
      jsonWorldComponentContentPaths: {
        en: {
          DestinyActivityDefinition: "/DestinyActivityDefinition/en/",
          DestinyBondDefinition: "/DestinyBondDefinition/en/",
          DestinyClassDefinition: "/DestinyClassDefinition/en/",
        } as Record<ManifestDefinition, string>,
        pl: {
          DestinyActivityDefinition: "/DestinyActivityDefinition/pl/",
          DestinyBondDefinition: "/DestinyBondDefinition/pl/",
          DestinyClassDefinition: "/DestinyClassDefinition/pl/",
        } as Record<ManifestDefinition, string>,
      } as Record<Language, Record<ManifestDefinition, string>>,
      version: "any",
    };

    const spec = makeManifestSpec(response, "en", [
      "DestinyActivityDefinition",
      "DestinyBondDefinition",
    ]);
    expect(JSON.stringify(spec)).to.equal(
      JSON.stringify({
        version: "any",
        worldContent: {
          DestinyActivityDefinition: "/DestinyActivityDefinition/en/",
          DestinyBondDefinition: "/DestinyBondDefinition/en/",
        },
      })
    );
  });
});
