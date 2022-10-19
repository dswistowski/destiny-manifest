import React from "react";
import { manifest } from "../manifest";
import { DestinyInventoryItemStatDefinition } from "bungie-api-ts/destiny2";

export const Stat: React.FC<{ stat: DestinyInventoryItemStatDefinition }> = ({
    stat,
}) => {
    const { data: statDefinition } = manifest.useDestinyStatDefinition(
        `${stat.statHash}`
    );
    if (!statDefinition) return null;
    if (statDefinition.displayProperties.name === "") return null;
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                console.log(
                    "stataDefinition",
                    JSON.stringify(statDefinition, null, 2),
                    stat
                );
            }}
        >
            <span className="font-bold">
                {statDefinition?.displayProperties.name}
            </span>{" "}
            {stat.value}/{stat.displayMaximum || stat.maximum}
        </div>
    );
};
