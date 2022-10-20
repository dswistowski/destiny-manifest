import { useQuery } from "@tanstack/react-query";
import type {
  Activity,
  Equipment,
  Instance,
  PartyMember,
  Perk,
  PlugState,
  Profile,
  SearchResult,
  Socket,
  TalentGrid,
} from "../types/bungie";
import { BUNGIE_API_KEY } from "../config";
import {
  DestinyCharacterComponent,
  DestinyItemInstanceComponent,
} from "bungie-api-ts/destiny2";

const fetchMember = async (
  membershipId: string,
  membershipType: number,
  components: number[]
) => {
  const joinedComponents = components.map((c) => `${c}`).join(",");
  const response = await fetch(
    `https://www.bungie.net/platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=${joinedComponents}`,
    {
      headers: {
        "X-API-Key": BUNGIE_API_KEY,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search for user");
  }
  const data = await response.json();
  if (data.ErrorStatus !== "Success") {
    throw new Error("Failed to search for user");
  }
  return data;
};

const getLastCharacter = (characters: DestinyCharacterComponent[]) => {
  return characters.sort(
    (a, b) => -("" + a.dateLastPlayed).localeCompare(b.dateLastPlayed)
  )[0];
};

const fetchMemberInventory = async (
  membershipId: string,
  membershipType: number
) => {
  const response = await fetchMember(
    membershipId,
    membershipType,
    [100, 200, 205, 300, 302, 305, 306, 308]
  );
  console.log(JSON.stringify(response));
  const characters = Object.values(
    response.Response.characters.data
  ) as DestinyCharacterComponent[];
  const currentCharacter = getLastCharacter(characters);
  const equipment = response.Response.characterEquipment.data[
    currentCharacter.characterId
  ].items as Equipment[];
  const instanceIds = equipment.map((e) => e.itemInstanceId);
  const itemHashes = new Map<string, number>(
    equipment.map((e) => [e.itemInstanceId, e.itemHash])
  );
  const instances = response.Response.itemComponents.instances.data;
  const sockets = response.Response.itemComponents.sockets.data;
  const talentGrids = response.Response.itemComponents.talentGrids.data;
  const plugStates = response.Response.itemComponents.plugStates.data;
  const perks = response.Response.itemComponents.perks.data;

  const itemComponents = Object.fromEntries(
    instanceIds.map((id) => [
      id,
      {
        instance: instances[id] as DestinyItemInstanceComponent,
        sockets: (sockets[id]?.sockets || []) as Socket[],
        talentGrid: talentGrids[id] as TalentGrid,
        plugState: plugStates[`${itemHashes.get(id)}`] as PlugState,
        perks: (perks[id]?.perks || []) as Perk[],
      },
    ])
  );
  const profile = response.Response.profile.data as Profile;
  const plugSet =
    response.Response.characterPlugSets.data[currentCharacter.characterId];
  return {
    profile,
    currentCharacter,
    equipment,
    itemComponents,
    plugSet,
  };
};

export type MemberInventory = Awaited<ReturnType<typeof fetchMemberInventory>>;

const fetchTeammates = async (membershipId: string, membershipType: number) => {
  const data = await fetchMember(
    membershipId,
    membershipType,
    [200, 204, 1000]
  );
  const partyMembers = (data.Response.profileTransitoryData.data
    ?.partyMembers || []) as PartyMember[];

  const characters = Object.values(
    data.Response.characters.data
  ) as DestinyCharacterComponent[];
  const lastCharacter = getLastCharacter(characters);
  const activity =
    data.Response.characterActivities.data[lastCharacter.characterId];
  if (activity.availableActivities) {
    delete activity.availableActivities;
  }
  const party = await Promise.all(
    partyMembers.map((member) =>
      fetchMemberInventory(
        member.membershipId,
        member.membershipType ?? membershipType
      )
    )
  );

  return {
    party,
    lastCharacter,
    activity: activity as Activity,
  };
};

const fetchSearchProfile = async (namePrefix: string, page = 0) => {
  const response = await fetch(
    `https://www.bungie.net/platform/User/Search/GlobalName/${page}/`,
    {
      method: "POST",
      headers: {
        "X-API-Key": BUNGIE_API_KEY,
      },
      body: JSON.stringify({
        displayNamePrefix: namePrefix,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to search for user");
  }
  const data = await response.json();
  if (data.ErrorStatus !== "Success") {
    throw new Error("Failed to search for user");
  }
  return {
    hasMore: data.Response.hasMore as boolean,
    results: data.Response.searchResults as SearchResult[],
  };
};

export const useSearchProfile = (namePrefix: string, page = 0) => {
  return useQuery(
    [
      "user.search.globalname",
      {
        page,
        namePrefix,
      },
    ],
    async () => fetchSearchProfile(namePrefix, page),
    { enabled: !!namePrefix, }
  );
};

export const useTeammates = (membershipId: string, membershipType: number) => {
  return useQuery(
    ["user.teammates", { membershipId, membershipType }],
    async () => fetchTeammates(membershipId, membershipType)
  );
};
