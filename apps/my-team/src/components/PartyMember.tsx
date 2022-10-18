import React, { useMemo } from "react";
import { MemberInventory } from "../hooks/bungie";
import { manifest } from "../manifest";
import { CharacterStats } from "./CharacterStats";
import { Emblem } from "./Emblem";
import { ItemComponent } from "./ItemComponent";

export const PartyMember: React.FC<{ memberInventory: MemberInventory }> = ({
    memberInventory,
}) => {
    const character = memberInventory.currentCharacter;
    const allCharacterStats = new Set([...Object.keys(character.stats)]);
    const { data: characterStats } = manifest.useDestinyStatDefinitions((s) =>
        allCharacterStats.has(`${s.hash}`)
    );
    const allPerksHashes = useMemo(() => {
        return new Set([...Object.values(memberInventory.itemComponents).flatMap(inventory => inventory.perks)?.map(perk => `${perk.perkHash}`)]);
    }, [memberInventory.itemComponents])
    const { data: allPerks } = manifest.useDestinySandboxPerkDefinitions((s) => allPerksHashes.has(s.hash))
    return (
        <div
            className="grow shadow shadow-gray-500 bg-gray-300 rounded overflow-hidden"
            onClick={() => {
                console.log({ memberInventory, characterStats });
            }}
        >
            <Emblem profile={memberInventory.profile} character={character} />
            {/* <CharacterStats characterStats={characterStats!} stats={character.stats} /> */}
            {/* <div>
                {allPerks?.map((perk, i) => (
                    <>
                        <img src={`http://bungie.net${perk.displayProperties.icon}`} key={i} />
                        {JSON.stringify(perk)}
                    </>
                ))}
            </div> */}
            <ul>
                {memberInventory.equipment.map((item, i) => (
                    <li key={i}>
                        <ItemComponent
                            item={item}
                            component={memberInventory.itemComponents[item.itemInstanceId]}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
