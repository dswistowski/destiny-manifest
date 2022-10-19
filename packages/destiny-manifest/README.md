# Destiny manifest

This package contains helper to use destiny manifest in frontend typescript application.

## Installation

```bash
npm add @dswistowski/destiny-manifest
```

## Usage

```typescript
import { createLoader } from "@dswistowski/destiny-manifest";
import { createDefaultManifest } from "@dswistowski/destiny-manifest";

// loader define what you want to persist from manifest data
const loader = createLoader()
  // add function is typed, you IDE will help you with options
  .add("DestinyInventoryBucketDefinition", (r) => ({
    hash: r.hash,
    displayProperties: r.displayProperties,
  }))
  .add("DestinyInventoryItemDefinition", (r) => r);

// createDefaultManifest use indexedDB to persist data,
// createVolatileManifest use memory to persist data
// you can use your own implementation of storage  and use createManifest
const manifest = createDefaultManifest({
  loader,
  apiKey: process.env.BUNGIE_API_KEY,
  language: "en",
});

manifest.triggers.onReady(async () => {
  // manifest.get, manifest.findMany, manifest.getMany are typesafe
  // they will return what you did define in your loader
  const bucket = await manifest.get(
    "DestinyInventoryBucketDefinition",
    1469714392
  );
  console.log(bucket);
  const items = await manifest.findMany(
    "DestinyInventoryItemDefinition",
    (inventoryItem) => inventoryItem.inventory.bucketTypeHash === bucket.hash
  );
  console.log(items);
});
```
