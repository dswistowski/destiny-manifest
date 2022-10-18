import React from "react";
import { Domains } from "../manifest";


export const CharacterStats: React.FC<{
    characterStats: Domains["DestinyStatDefinition"][];
    stats: { [hash: number]: number; };
}> = ({ characterStats, stats }) => (
    <div className="p-2">
        Stats
        {characterStats
            ?.sort((a, b) => a.index - b.index)
            .map((stat) => (
                <div key={stat.hash} className="flex gap-2 items-center">
                    <img
                        className="w-6"
                        src={`https://bungie.net${stat.displayProperties.icon}`} />
                    <span className="font-bold">{stat.displayProperties.name}</span>{" "}
                    {stats[stat.hash]}
                </div>
            ))}
    </div>
);
