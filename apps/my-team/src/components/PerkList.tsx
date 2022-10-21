import React from "react";
import { Domains } from "../manifest";

const CollapsedPerkList: React.FC<{
  perks: Domains["DestinySandboxPerkDefinition"][];
}> = ({ perks }) => (
  <>
    {perks.map((perk, i) => (
      <img
        alt={perk.displayProperties.name}
        onClick={() => console.log(perk)}
        src={`http://bungie.net${perk.displayProperties.icon}`}
        key={i}
        className="w-12"
      />
    ))}
  </>
);
const LongPerkList: React.FC<{
  perks: Domains["DestinySandboxPerkDefinition"][];
}> = ({ perks }) => (
  <div className="p-2 flex flex-col gap-4 w-full">
    {perks.map((perk, i) => (
      <div>
        <div className="flex items-center gap-2 font-bold text-lg">
          <img
            alt={perk.displayProperties.name}
            onClick={() => console.log(perk)}
            src={`http://bungie.net${perk.displayProperties.icon}`}
            key={i}
            className="w-12"
          />
          {perk.displayProperties.name}
        </div>
        <div className="text-gray-700">
          {perk.displayProperties.description}
        </div>
      </div>
    ))}
  </div>
);
export const PerkList: React.FC<{
  perks: Domains["DestinySandboxPerkDefinition"][];
}> = ({ perks }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  perks.sort((a, b) => a.index - b.index);
  return (
    <div
      className="flex flex-wrap gap-1 cursor-pointer"
      onClick={() => setCollapsed(!collapsed)}
    >
      {collapsed ? (
        <CollapsedPerkList perks={perks} />
      ) : (
        <LongPerkList perks={perks} />
      )}
    </div>
  );
};
