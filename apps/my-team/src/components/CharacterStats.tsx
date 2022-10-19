import React from "react";
import { Domains } from "../manifest";

const CollapsedCharacterStats: React.FC<{
    characterStats: Domains["DestinyStatDefinition"][];
    stats: { [hash: number]: number };
}> = ({ characterStats, stats }) => (
    <div className="grid grid-cols-4">
        {characterStats
            ?.sort((a, b) => a.index - b.index)
            .map((stat) => (
                <div key={stat.hash} className="flex gap-2 items-center">
                    <img
                        className="w-6"
                        src={`https://bungie.net${stat.displayProperties.icon}`}
                    />
                    {stats[stat.hash]}
                </div>
            ))}
    </div>
);

const LongCharacterStats: React.FC<{
    characterStats: Domains["DestinyStatDefinition"][];
    stats: { [hash: number]: number };
}> = ({ characterStats, stats }) => (
    <div>
        {characterStats
            ?.sort((a, b) => a.index - b.index)
            .map((stat) => (
                <div key={stat.hash} className="flex gap-2 items-center">
                    <img
                        className="w-6"
                        src={`https://bungie.net${stat.displayProperties.icon}`}
                    />
                    <span className="font-bold">
                        {stat.displayProperties.name}
                    </span>{" "}
                    {stats[stat.hash]}
                </div>
            ))}
    </div>
);

export const CharacterStats: React.FC<{
    characterStats: Domains["DestinyStatDefinition"][];
    stats: { [hash: number]: number };
}> = ({ characterStats, stats }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    return (
        <div
            className="p-2 cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
        >
            {isCollapsed ? (
                <CollapsedCharacterStats
                    characterStats={characterStats}
                    stats={stats}
                />
            ) : (
                <LongCharacterStats
                    characterStats={characterStats}
                    stats={stats}
                />
            )}
        </div>
    );
};
