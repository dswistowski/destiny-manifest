import React from "react";
import { Domains, manifest } from "../manifest";
import { DestinyItemInstanceComponent } from "bungie-api-ts/destiny2";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Disclosure, Transition } from "@headlessui/react";
import { Stat } from "./Stat";

export const Item: React.FC<{
  item: Domains["DestinyInventoryItemDefinition"];
  instance: DestinyItemInstanceComponent;
}> = ({ item, instance }) => {
  const { data: breakerType } = manifest.useDestinyBreakerTypeDefinition(
    instance.breakerType ? `${instance.breakerType}` : ""
  );
  const { data: primaryStat } = manifest.useDestinyStatDefinition(
    instance.primaryStat ? `${instance.primaryStat.statHash}` : ""
  );
  const { data: damageType } = manifest.useDestinyDamageTypeDefinition(
    instance.damageType ? `${instance.damageTypeHash}` : ""
  );
  return (
    <div
      className="ml-2 text-sm"
      onClick={() => {
        console.log("item", JSON.stringify(item, null, 2));
        console.log("instance", JSON.stringify(instance, null, 2));
        console.log("damageType", JSON.stringify(damageType, null, 2));
      }}
    >
      <div className="relative w-fit">
        <img
          className="roundedshadow"
          src={`https://www.bungie.net${item.displayProperties.icon}`}
        />
        {item.iconWatermark ? (
          <img
            className="absolute top-0"
            src={`https://www.bungie.net${item.iconWatermark}`}
          />
        ) : null}
        {damageType ? (
          <img
            className="absolute bottom-1 right-1 w-6 h-6"
            src={`https://www.bungie.net${damageType.displayProperties.icon}`}
          />
        ) : null}
      </div>
      {item.displayProperties.name}
      {primaryStat ? (
        <div>
          {primaryStat?.displayProperties.name} {instance.primaryStat?.value}
        </div>
      ) : null}
      <div className="w-full">
        <Disclosure>
          <Disclosure.Button className="flex items-center w-full bg-gray-400 p-1 rounded">
            <>
              <div className="grow">Stats</div>
              <ChevronRightIcon className="ui-open:rotate-90 ui-open:transform w-4 h-4" />
            </>
          </Disclosure.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="bg-gray-200 rounded shadow p-2">
              {item.stats
                ? Object.values(item.stats.stats).map((stat) => (
                    <Stat key={stat.statHash} stat={stat} />
                  ))
                : null}
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      </div>
    </div>
  );
};
