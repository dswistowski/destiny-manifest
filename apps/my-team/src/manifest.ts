import {
  createDefaultManifest,
  createLoader,
  inferDomains,
} from "@dswistowski/destiny-manifest-react";
import { BUNGIE_API_KEY } from "./config";
import { store } from "./store";

const loader = createLoader()
  .add("DestinyInventoryItemDefinition", (item) => item)
  .add("DestinyBreakerTypeDefinition", (breaker) => breaker)
  .add("DestinySandboxPerkDefinition", (perk) => perk)
  .add("DestinyStatDefinition", (stat) => stat)
  .add("DestinyDamageTypeDefinition", (damageType) => damageType)
  .add("DestinyInventoryBucketDefinition", (bucket) => ({
    hash: bucket.hash,
    name: bucket.displayProperties.name,
    description: bucket.displayProperties.description,
    order: bucket.bucketOrder,
  }));

const language = store.getState().language;

export const manifest = createDefaultManifest({
  loader,
  apiKey: BUNGIE_API_KEY,
  language,
  dbName: "my-team",
  
});

export type Domains = inferDomains<typeof loader>;
