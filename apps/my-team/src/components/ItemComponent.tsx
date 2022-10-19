import React from "react";
import { Equipment } from "../types/bungie";
import { manifest } from "../manifest";
import { PerkIcon } from "./PerkIcon";
import { Bucket } from "./Bucket";
import { Component } from "../routes/member";
import { Item } from "./Item";

export const ItemComponent: React.FC<{
    item: Equipment;
    component: Component;
}> = ({ item, component }) => {
    const { data: itemDefinition } = manifest.useDestinyInventoryItemDefinition(
        `${item.itemHash}`
    );
    const { data: itemBucket } = manifest.useDestinyInventoryBucketDefinition(
        `${item.bucketHash}`
    );

    return (
        <>
            {itemBucket ? <Bucket bucket={itemBucket} /> : null}
            <div className="flex gap-2">
                <div className="basis-1/2">
                    {itemDefinition ? (
                        <Item
                            item={itemDefinition}
                            instance={component.instance}
                        />
                    ) : null}
                </div>
                <div className="flex flex-col grow gap-1 basis-1/2">
                    {component.perks
                        .filter((perk) => perk.visible)
                        .filter((perk) => perk.isActive)
                        .map((perk, i) => (
                            <PerkIcon key={i} perk={perk} />
                        ))}
                </div>
            </div>
        </>
    );
};
