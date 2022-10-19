import * as destiny2 from "bungie-api-ts/destiny2";
import { createLoader } from "./loaders";
import { Store } from "./store";

export type Language =
  | "en"
  | "fr"
  | "es"
  | "es-mx"
  | "de"
  | "it"
  | "ja"
  | "pt-br"
  | "ru"
  | "pl"
  | "ko"
  | "zh-cht"
  | "zh-chs";

export const allLanguages: Language[] = [
  "en",
  "fr",
  "es",
  "es-mx",
  "de",
  "it",
  "ja",
  "pt-br",
  "ru",
  "pl",
  "ko",
  "zh-cht",
  "zh-chs",
];

export type Manifest = {
  DestinyNodeStepSummaryDefinition: destiny2.DestinyNodeStepDefinition & {
    hash: string;
  };
  DestinyArtDyeChannelDefinition: { hash: string };
  DestinyArtDyeReferenceDefinition: destiny2.DestinyArtDyeReference & {
    hash: string;
  };
  DestinyPlaceDefinition: destiny2.DestinyPlaceDefinition & { hash: string };
  DestinyActivityDefinition: destiny2.DestinyActivityDefinition & {
    hash: string;
  };
  DestinyActivityTypeDefinition: destiny2.DestinyActivityTypeDefinition & {
    hash: string;
  };
  DestinyClassDefinition: destiny2.DestinyClassDefinition & { hash: string };
  DestinyGenderDefinition: destiny2.DestinyGenderDefinition & { hash: string };
  DestinyInventoryBucketDefinition: destiny2.DestinyInventoryBucketDefinition & {
    hash: string;
  };
  DestinyRaceDefinition: destiny2.DestinyRaceDefinition & { hash: string };
  DestinyTalentGridDefinition: destiny2.DestinyTalentGridDefinition & {
    hash: string;
  };
  DestinyUnlockDefinition: destiny2.DestinyUnlockDefinition & { hash: string };
  DestinySandboxPerkDefinition: destiny2.DestinySandboxPerkDefinition & {
    hash: string;
  };
  DestinyStatGroupDefinition: destiny2.DestinyStatGroupDefinition & {
    hash: string;
  };
  DestinyProgressionMappingDefinition: destiny2.DestinyProgressionMappingDefinition & {
    hash: string;
  };
  DestinyFactionDefinition: destiny2.DestinyFactionDefinition & {
    hash: string;
  };
  DestinyVendorGroupDefinition: destiny2.DestinyVendorGroupDefinition & {
    hash: string;
  };
  DestinyRewardSourceDefinition: destiny2.DestinyRewardSourceDefinition & {
    hash: string;
  };
  DestinyUnlockValueDefinition: destiny2.DestinyUnlockValueDefinition & {
    hash: string;
  };
  DestinyRewardMappingDefinition: { hash: string };
  DestinyRewardSheetDefinition: { hash: string };
  DestinyItemCategoryDefinition: destiny2.DestinyItemCategoryDefinition & {
    hash: string;
  };
  DestinyDamageTypeDefinition: destiny2.DestinyDamageTypeDefinition & {
    hash: string;
  };
  DestinyActivityModeDefinition: destiny2.DestinyActivityModeDefinition & {
    hash: string;
  };
  DestinyMedalTierDefinition: destiny2.DestinyMedalTierDefinition & {
    hash: string;
  };
  DestinyAchievementDefinition: { hash: string };
  DestinyActivityGraphDefinition: destiny2.DestinyActivityGraphDefinition & {
    hash: string;
  };
  DestinyActivityInteractableDefinition: { hash: string };
  DestinyBondDefinition: { hash: string };
  DestinyCharacterCustomizationCategoryDefinition: { hash: string };
  DestinyCharacterCustomizationOptionDefinition: { hash: string };
  DestinyCollectibleDefinition: destiny2.DestinyCollectibleDefinition & {
    hash: string;
  };
  DestinyDestinationDefinition: destiny2.DestinyDestinationDefinition & {
    hash: string;
  };
  DestinyEntitlementOfferDefinition: { hash: string };
  DestinyEquipmentSlotDefinition: destiny2.DestinyEquipmentSlotDefinition & {
    hash: string;
  };
  DestinyEventCardDefinition: destiny2.DestinyEventCardDefinition & {
    hash: string;
  };
  DestinyStatDefinition: destiny2.DestinyStatDefinition & { hash: string };
  DestinyInventoryItemDefinition: destiny2.DestinyInventoryItemDefinition & {
    hash: string;
  };
  DestinyInventoryItemLiteDefinition: { hash: string };
  DestinyItemTierTypeDefinition: destiny2.DestinyItemTierTypeDefinition & {
    hash: string;
  };
  DestinyLocationDefinition: destiny2.DestinyLocationDefinition & {
    hash: string;
  };
  DestinyLoreDefinition: destiny2.DestinyLoreDefinition & { hash: string };
  DestinyMaterialRequirementSetDefinition: destiny2.DestinyMaterialRequirementSetDefinition & {
    hash: string;
  };
  DestinyMetricDefinition: destiny2.DestinyMetricDefinition & { hash: string };
  DestinyObjectiveDefinition: destiny2.DestinyObjectiveDefinition & {
    hash: string;
  };
  DestinyPlatformBucketMappingDefinition: { hash: string };
  DestinyPlugSetDefinition: destiny2.DestinyPlugSetDefinition & {
    hash: string;
  };
  DestinyPowerCapDefinition: destiny2.DestinyPowerCapDefinition & {
    hash: string;
  };
  DestinyPresentationNodeDefinition: destiny2.DestinyPresentationNodeDefinition & {
    hash: string;
  };
  DestinyProgressionDefinition: destiny2.DestinyProgressionDefinition & {
    hash: string;
  };
  DestinyProgressionLevelRequirementDefinition: destiny2.DestinyProgressionLevelRequirementDefinition & {
    hash: string;
  };
  DestinyRecordDefinition: destiny2.DestinyRecordDefinition & { hash: string };
  DestinyRewardAdjusterPointerDefinition: { hash: string };
  DestinyRewardAdjusterProgressionMapDefinition: { hash: string };
  DestinyRewardItemListDefinition: { hash: string };
  DestinySackRewardItemListDefinition: { hash: string };
  DestinySandboxPatternDefinition: destiny2.DestinySandboxPatternDefinition & {
    hash: string;
  };
  DestinySeasonDefinition: destiny2.DestinySeasonDefinition & { hash: string };
  DestinySeasonPassDefinition: destiny2.DestinySeasonPassDefinition & {
    hash: string;
  };
  DestinySocketCategoryDefinition: destiny2.DestinySocketCategoryDefinition & {
    hash: string;
  };
  DestinySocketTypeDefinition: destiny2.DestinySocketTypeDefinition & {
    hash: string;
  };
  DestinyTraitDefinition: destiny2.DestinyTraitDefinition & { hash: string };
  DestinyTraitCategoryDefinition: destiny2.DestinyTraitCategoryDefinition & {
    hash: string;
  };
  DestinyUnlockCountMappingDefinition: { hash: string };
  DestinyUnlockEventDefinition: { hash: string };
  DestinyUnlockExpressionMappingDefinition: { hash: string };
  DestinyVendorDefinition: destiny2.DestinyVendorDefinition & { hash: string };
  DestinyMilestoneDefinition: destiny2.DestinyMilestoneDefinition & {
    hash: string;
  };
  DestinyActivityModifierDefinition: destiny2.DestinyActivityModifierDefinition & {
    hash: string;
  };
  DestinyReportReasonCategoryDefinition: destiny2.DestinyReportReasonCategoryDefinition & {
    hash: string;
  };
  DestinyArtifactDefinition: destiny2.DestinyArtifactDefinition & {
    hash: string;
  };
  DestinyBreakerTypeDefinition: destiny2.DestinyBreakerTypeDefinition & {
    hash: string;
  };
  DestinyChecklistDefinition: destiny2.DestinyChecklistDefinition & {
    hash: string;
  };
  DestinyEnergyTypeDefinition: destiny2.DestinyEnergyTypeDefinition & {
    hash: string;
  };
};
export type ManifestDefinition = keyof Manifest;

export type ManifestResponse = {
  version: string;
  jsonWorldComponentContentPaths: Record<
    Language,
    Record<ManifestDefinition, string>
  >;
};

export const makeManifestSpec = (
  response: ManifestResponse,
  language: Language,
  specs: ManifestDefinition[]
) => {
  return {
    version: response.version,
    worldContent: Object.fromEntries(
      Object.entries(response.jsonWorldComponentContentPaths[language]).filter(
        ([name]) => specs.includes(name as ManifestDefinition)
      )
    ) as Record<ManifestDefinition, string>,
  };
};

export type ManifestSpec = ReturnType<typeof makeManifestSpec>;

export type Loader = ReturnType<typeof createLoader>;

export type Processors<L extends Loader> = L["loaders"] extends {
  [key in keyof L["loaders"]]: (data: any) => L["loaders"][keyof L["loaders"]];
}
  ? L["loaders"]
  : never;
export type ProcessedTypes<L extends Loader> = {
  [MT in keyof Processors<L>]: ProcessedType<L, MT>;
};

export type inferDomains<T extends Loader> = {
  [K in keyof T["loaders"]]: T["loaders"][K] extends (row: any) => infer R
    ? R
    : never;
};

export type WithHash<T> = T extends { hash: string } ? T : never;

export type ProcessedType<L extends Loader, T> = T extends keyof L["loaders"]
  ? Processors<L>[T] extends (...args: any) => infer R
    ? R
    : never
  : never;

export type LoaderParam<L extends Loader, T> = T extends keyof L["loaders"]
  ? Processors<L>[T] extends (param: infer Param) => any
    ? Param
    : never
  : never;

export type Processor<L extends Loader, T extends keyof L["loaders"]> = (
  param: LoaderParam<L, T>
) => ProcessedType<L, T>;

export type State = {
  isReady: boolean;
  dbInitialized: boolean;
  error?: string;
  spec?: ManifestSpec;
};

export type ManifestStore = Store<State>;
