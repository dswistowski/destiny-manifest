import React from "react";
import { Perk } from "../types/bungie";
import { manifest } from "../manifest";

export const PerkIcon: React.FC<{ perk: Perk }> = ({ perk }) => {
  const { data: perkDefinition } = manifest.useDestinySandboxPerkDefinition(
    `${perk.perkHash}`
  );
  return (
    <div className="flex gap-2 items-center">
      <img
        src={`https://bungie.net${perk.iconPath}`}
        className="w-10 h-10"
        onClick={() => console.log(JSON.stringify(perkDefinition))}
      />
      {perkDefinition?.displayProperties.name}
    </div>
  );
};
