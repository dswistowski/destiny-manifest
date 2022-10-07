# Destiny manifest react

This package contains helper to use destiny manifest in frontend typescript react application.

## Installation

```bash
npm add @dswistowski/destiny-manifest-react
```

## Usage

1. Create manifest module with loader:

```typescript
import {
  createDefaultManifest,
  createLoader,
  inferDomains,
} from "@dswistowski/destiny-manifest-react";

const loader = createLoader()
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
  apiKey: process.env.REACT_APP_BUNGIE_API_KEY,
  language: "en",
});

export type Domains = inferDomains<typeof loader>;
```


And then use it in your application:

```tsx
import { manifest, Domains } from "./manifest";

const LoreDefinition: React.FC<{lore: Domains["DestinyLoreDefinition"]}> = ({ lore }) => {
  return (
    <div>
      <h1>{lore.displayProperties.name}</h1>
      <p>{lore.displayProperties.description}</p>
    </div>
  );
};

const ItemDefinition: React.FC<{item: Domains["DestinyInventoryItemDefinition"]}> = ({ item }) => {
  const lore = manifest.useDestinyLoreDefinition(item.loreHash);
  return (
    <div>
      <h1>{item.displayProperties.name}</h1>
      <p>{item.displayProperties.description}</p>
      {lore && <LoreDefinition lore={lore} />}
    </div>
  );
};

const Items: React.FC = () => {
  const items = manifest.useDestinyInventoryItemDefinitions(() => true);
  return (
    <div>
      {items.map((item) => (
        <ItemDefinition  key={item.hash} item={item} />
      ))}
    </div>
  );
};
```
