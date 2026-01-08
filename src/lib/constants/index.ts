// src/lib/constants/index.ts

import { GearCategory } from "../types";

// 1. ジョブ定義
export const JOBS = [
	'WAR', 'MNK', 'WHM', 'BLM', 'RDM', 'THF', 'PLD', 'DRK', 'BST', 'BRD',
	'RNG', 'SAM', 'NIN', 'DRG', 'SMN', 'BLU', 'COR', 'PUP', 'DNC', 'SCH', 'GEO', 'RUN'
] as const;
export type JobCode = typeof JOBS[number];

// 2. スロット定義
export const MAJOR_SLOTS = [
	{ id: 'head', name: '頭', icon: '🪖' },
	{ id: 'body', name: '胴', icon: '👕' },
	{ id: 'hands', name: '手', icon: '🧤' },
	{ id: 'legs', name: '脚', icon: '👖' },
	{ id: 'feet', name: '足', icon: '👟' },
] as const;

// 3. アイデンティティ定義
export const WORLDS = [
	'Asura', 'Bahamut', 'Bismarck', 'Carbuncle', 'Cerberus', 'Fenrir',
	'Lakshmi', 'Leviathan', 'Odin', 'Phoenix', 'Quetzalcoatl', 'Ragnarok',
	'Shiva', 'Siren', 'Valefor'
] as const;

export const RACES = ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'] as const;
export type Race = typeof RACES[number];
export type Gender = 'Male' | 'Female';

// 4. 装備・ティア定義
export const GEAR_CATEGORIES: GearCategory[] = ['AF', 'Relic', 'Empyrean'];

export const TIER_109_VALUE: Record<GearCategory, number> = {
	AF: 2,
	Relic: 4,
	Empyrean: 3,
};

export const JOB_MIN_TIER_RULES: Record<string, Record<GearCategory, number>> = {
	GEO: TIER_109_VALUE,
	RUN: TIER_109_VALUE,
};