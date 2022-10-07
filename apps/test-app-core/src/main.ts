import { createLoader } from "@dswistowski/destiny-manifest";
import { createDefaultManifest } from "@dswistowski/destiny-manifest";

const input = document.querySelector<HTMLInputElement>("#search");
const list = document.querySelector<HTMLUListElement>("#list");
if (input === null || list === null) throw new Error("Missing input or list");

const loader = createLoader()
  .add("DestinyInventoryBucketDefinition", (r) => ({
    hash: r.hash,
    displayProperties: r.displayProperties,
  }))
  .add("DestinyInventoryItemDefinition", (r) => r);

const manifest = createDefaultManifest({
  loader,
  apiKey: "95ff63b2566b4c19ac6b06b0123d8014",
  language: "en",
});

function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), ms);
  };
}

manifest.triggers.onReady(async () => {
  input.disabled = false;
  list.innerHTML = "";
  input.onkeyup = debounce((e) => {
    const value = (e.target as HTMLInputElement).value;
    manifest
      .findMany("DestinyInventoryItemDefinition", (r) =>
        r.displayProperties.name.includes(value)
      )
      .then((items) => {
        list.innerHTML = "";
        items.slice(0, 100).forEach((item) => {
          const li = document.createElement("li");
          const img = document.createElement("img");
          li.append(img);
          img.src = `https://www.bungie.net${item.displayProperties.icon}`;
          const span = document.createElement("span");
          span.textContent = `${item.displayProperties.name} (${item.hash})`;
          li.append(span);
          list.appendChild(li);
        });
      });
  }, 500);
});
