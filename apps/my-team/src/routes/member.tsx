import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { MemberInventory, useTeammates } from "../hooks/bungie";
import * as teammates from "./teammates.json";
import { PartyMember } from "../components/PartyMember";

type TeammatesQueryData = ReturnType<typeof useTeammates>["data"];
type ItemComponents = MemberInventory["itemComponents"];
type RecordValues<T> = T extends Record<string, infer V> ? V : never;
export type Component = RecordValues<ItemComponents>;

const Member: React.FC = () => {
  const params = useParams();
  const data = useMemo(() => teammates as unknown as TeammatesQueryData, [])
  /*
  const { data } = useTeammates(
    params.membershipId as string,
    parseInt(params.membershipType as string)
  );
  */


  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
        {data?.party.map((member) => (
          <PartyMember
            key={member.currentCharacter.characterId}
            memberInventory={member}
          />
        ))}
      </div>
    </>
  );
};

export default Member;
