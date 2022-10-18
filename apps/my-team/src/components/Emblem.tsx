import React from "react";
import { Profile } from "../types/bungie";
import { manifest } from "../manifest";
import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";

export const Emblem: React.FC<{
    profile: Profile;
    character: DestinyCharacterComponent;
}> = ({ profile, character }) => {
    return (
        <header
            className="bg-cover pl-8 aspect-[474/96] flex flex-wrap  gap-2 items-center justify-end p-4  text-outline font-extrabold"
            style={{
                backgroundImage: `url(https://www.bungie.net${character.emblemBackgroundPath})`,
            }}
        >
            <div>
                {profile.userInfo.bungieGlobalDisplayName}
                <span className="text-blue-800">
                    #{profile.userInfo.bungieGlobalDisplayNameCode}
                </span>
            </div>
            <div>{character.light}</div>
        </header>
    );
};
