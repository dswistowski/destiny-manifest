import React from "react";
import { Domains } from "../manifest";

export const Bucket: React.FC<{
    bucket: Domains["DestinyInventoryBucketDefinition"];
}> = ({ bucket }) => {
    return (
        <div
            className="text-2xl p-2 font-bold"
            onClick={() =>
                console.log("bucket", JSON.stringify(bucket, null, 2))
            }
        >
            {bucket.name}
        </div>
    );
};
