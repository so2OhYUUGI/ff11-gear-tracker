// src/types/gear.ts

export type JobType =
	| "WAR" | "MNK" | "WHM" | "BLM" | "RDM" | "THF" | "PLD" | "DRK"
	| "BST" | "BRD" | "RNG" | "SAM" | "NIN" | "DRG" | "SMN" | "BLU"
	| "COR" | "PUP" | "DNC" | "SCH" | "GEO" | "RUN";

export type GearSlot = "Head" | "Body" | "Hands" | "Legs" | "Feet";

export type GearType = "AF" | "Relic" | "Empy";

export type GearStage = "119" | "+1" | "+2" | "+3";

export interface GearPlan {
	type: GearType;
	stage: GearStage;
}

// 部位ごとのプランを保持するオブジェクトの型
export type FullGearPlan = Record<GearSlot, GearPlan>;

// コンポーネントのProps型もここに定義しておくとスッキリします
export interface JobSelectorProps {
	selectedJob: string;
	onSelect: (job: JobType) => void;
}

export interface GearPlannerProps {
	job: string;
	plan: FullGearPlan;
	onPlanChange: (slot: GearSlot, value: GearPlan) => void;
}