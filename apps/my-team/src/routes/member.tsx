import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { MemberInventory, useTeammates } from "../hooks/bungie";
// import * as teammates from "./teammates.json";
import { PartyMember } from "../components/PartyMember";
import Spinner from "../components/Spinner";

type TeammatesQueryData = ReturnType<typeof useTeammates>["data"];
type ItemComponents = MemberInventory["itemComponents"];
type RecordValues<T> = T extends Record<string, infer V> ? V : never;
export type Component = RecordValues<ItemComponents>;

const Member: React.FC = () => {
  const params = useParams();
  // const data = useMemo(() => teammates as unknown as TeammatesQueryData, []);
  const { data, isLoading } = useTeammates(
    params.membershipId as string,
    parseInt(params.membershipType as string)
  );
  if (isLoading) {
    return <Spinner className="text-gray-600 w-48 self-center" />;
  }
  if (!data?.party.length) {
    return <div className="text-xl p-2">Guardian is not online</div>;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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
