import {
  createDefaultManifest, createVolatileManifest,
  createLoader,
  inferDomains,
} from "@dswistowski/destiny-manifest-react";
import { BUNGIE_API_KEY } from "./config";

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

export const manifest = createVolatileManifest({
  loader,
  apiKey: BUNGIE_API_KEY,
  language: "en",
});

export type Domains = inferDomains<typeof loader>;
