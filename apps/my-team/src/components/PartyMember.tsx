import { getInvitedIndividuals } from "bungie-api-ts/groupv2";
import React, { useCallback, useMemo } from "react";
import { MemberInventory } from "../hooks/bungie";
import { manifest } from "../manifest";
import { CharacterStats } from "./CharacterStats";
import { Emblem } from "./Emblem";
import { ItemComponent } from "./ItemComponent";
import { PerkList } from "./PerkList";
import Spinner from "./Spinner";

const importantBuckets = [
    3448274439, // Helmet
    3551918588, // Gauntlets
    14239492, // Chest Armor
    20886954, // Leg Armor
    1585787867, // Class Item
    // 3284755031, // subclass
];

const notRelevantBuckets = new Set([
    4274335291, // Emblem
    4292445962, // Clan banner
    3683254069, // Finisher
    1107761855, // Emotes
    284967655, // Ships
    2025709351, // Sparrows
]);

export const PartyMember: React.FC<{ memberInventory: MemberInventory }> = ({
    memberInventory,
}) => {
    const character = memberInventory.currentCharacter;
    const allCharacterStats = useMemo(
        () => new Set([...Object.keys(character.stats)]),
        [character]
    );
    const { data: characterStats } = manifest.useDestinyStatDefinitions(
        useCallback(
            (s) => allCharacterStats.has(`${s.hash}`),
            [allCharacterStats]
        )
    );

    const perksPerBuckets = useCallback(
        (buckets: number[]) =>
            new Set(
                memberInventory.equipment
                    .filter((e) => buckets.includes(e.bucketHash))
                    .map(
                        (e) => memberInventory.itemComponents[e.itemInstanceId]
                    )
                    .flatMap((inventory) => inventory.perks)
                    .map((perk) => `${perk.perkHash}`)
            ),
        [memberInventory.equipment, memberInventory.itemComponents]
    );

    const importantPerkHashes = useMemo(
        () => perksPerBuckets(importantBuckets),
        [perksPerBuckets]
    );
    const characterPerksHashes = useMemo(
        () => perksPerBuckets([3284755031]),
        [perksPerBuckets]
    );

    const { data: importantPerks } = manifest.useDestinySandboxPerkDefinitions(
        useCallback(
            (s) => importantPerkHashes.has(s.hash),
            [importantPerkHashes]
        )
    );
    const { data: characterPerks } = manifest.useDestinySandboxPerkDefinitions(
        useCallback(
            (s) => characterPerksHashes.has(s.hash),
            [characterPerksHashes]
        )
    );

    return (
        <div
            className="grow shadow shadow-gray-500 bg-gray-300 rounded overflow-hidden"
            onClick={() => {
                console.log({ memberInventory, characterStats });
            }}
        >
            <Emblem profile={memberInventory.profile} character={character} />
            <CharacterStats
                characterStats={characterStats!}
                stats={character.stats}
            />
            {importantPerks ? (
                <PerkList
                    perks={importantPerks.filter((perk) => perk.isDisplayable)}
                />
            ) : (
                <Spinner className="w-12" />
            )}
            {characterPerks ? (
                <PerkList
                    perks={characterPerks.filter((perk) => perk.isDisplayable)}
                />
            ) : (
                <Spinner className="w-12" />
            )}
            <ul>
                {memberInventory.equipment
                    .filter((item) => !notRelevantBuckets.has(item.bucketHash))
                    .map((item, i) => (
                        <li key={i}>
                            <ItemComponent
                                item={item}
                                component={
                                    memberInventory.itemComponents[
                                        item.itemInstanceId
                                    ]
                                }
                            />
                        </li>
                    ))}
            </ul>
        </div>
    );
};
