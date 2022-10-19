export type PartyMember = {
  membershipId: string;
  membershipType?: number;
};

export type Instance = {
  instanceId: string;
  damageType: number;
  damageTypeHash: number;
  primaryStat: {
    statHash: number;
    value: number;
  };
  itemLevel: number;
  quality: number;
  isEquipped: boolean;
};

export type Socket = {
  plugHash: number;
  isEnabled: boolean;
  isVisible: boolean;
};

export type PlugState = {
  plugItemHash: number;
  canInsert: boolean;
  enabled: boolean;
};

export type Perk = {
  perkHash: number;
  iconPath: string;
  isActive: boolean;
  visible: boolean;
};

export type TalentGrid = {
  talentGridHash: number;
  isGridComplete: boolean;
};

export type Equipment = {
  itemHash: number;
  itemInstanceId: string;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
  dismantlePermission: number;
  overrideStyleItemHash: number;
  isWrapper: boolean;
};

export type Activity = {
  dateActivityStarted: string;
  currentActivityHash: number;
  currentActivityModeHash: number;
  currentPlaylistActivityHash: number;
  lastCompletedStoryHash: 0;
};

export type DestinyMembership = {
  iconPath: string;
  membershipType: number;
  membershipId: string;
  displayName: string;
  bungieGlobalDisplayName: string;
};

export type SearchResult = {
  bungieGlobalDisplayName: string;
  bungieNetMembershipId: string;
  bungieGlobalDisplayNameCode: number;
  destinyMemberships: DestinyMembership[];
};

export type Profile = {
  userInfo: {
    membershipId: string;
    membershipType: number;
    displayName: string;
    bungieGlobalDisplayName: string;
    bungieGlobalDisplayNameCode: number;
  };
  dateLastPlayed: "2022-09-30T22:58:23Z";
};
