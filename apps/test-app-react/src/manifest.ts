import {
  createDefaultManifest,
  createLoader,
  inferDomains,
} from "@dswistowski/destiny-manifest-react/src";

const loader = createLoader()
  .add("DestinyActivityDefinition", (e) => e)
  .add("DestinyActivityModeDefinition", (e) => e)
  .add("DestinyLoreDefinition", ({ hash, displayProperties, index }) => ({
    hash,
    displayProperties,
    index,
  }))
  .add(
    "DestinyInventoryItemDefinition",
    ({ hash, displayProperties, loreHash }) => ({
      hash,
      displayProperties,
    })
  );

export const manifest = createDefaultManifest({
  loader,
  apiKey: "95ff63b2566b4c19ac6b06b0123d8014",
  language: "en",
});

export type Domains = inferDomains<typeof loader>;
