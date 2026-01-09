/**
 * @file: index.ts (src/lib/constants)
 * 役割: アプリ共通の定数定義。
 */

import { GearCategory } from "../types";

// 1. ジョブ定義
export const JOBS = [
	'WAR', 'MNK', 'WHM', 'BLM', 'RDM', 'THF', 'PLD', 'DRK', 'BST', 'BRD',
	'RNG', 'SAM', 'NIN', 'DRG', 'SMN', 'BLU', 'COR', 'PUP', 'DNC', 'SCH', 'GEO', 'RUN'
] as const;

export type JobCode = typeof JOBS[number];

/**
 * ★ 追加: ジョブの表示名定義（日本語）
 * コンポーネント側での表示に使用します。
 */
export const JOB_DETAILS: Record<JobCode, { name: string, name_ja: string }> = {
	WAR: { name: 'Warrior', name_ja: '戦士' },
	MNK: { name: 'Monk', name_ja: 'モンク' },
	WHM: { name: 'White Mage', name_ja: '白魔道士' },
	BLM: { name: 'Black Mage', name_ja: '黒魔道士' },
	RDM: { name: 'Red Mage', name_ja: '赤魔道士' },
	THF: { name: 'Thief', name_ja: 'シーフ' },
	PLD: { name: 'Paladin', name_ja: 'ナイト' },
	DRK: { name: 'Dark Knight', name_ja: '暗黒騎士' },
	BST: { name: 'Beastmaster', name_ja: '獣使い' },
	BRD: { name: 'Bard', name_ja: '吟遊詩人' },
	RNG: { name: 'Ranger', name_ja: '狩人' },
	SAM: { name: 'Samurai', name_ja: '侍' },
	NIN: { name: 'Ninja', name_ja: '忍者' },
	DRG: { name: 'Dragoon', name_ja: '竜騎士' },
	SMN: { name: 'Summoner', name_ja: '召喚士' },
	BLU: { name: 'Blue Mage', name_ja: '青魔道士' },
	COR: { name: 'Corsair', name_ja: 'コルセア' },
	PUP: { name: 'Puppetmaster', name_ja: 'からくり士' },
	DNC: { name: 'Dancer', name_ja: '踊り子' },
	SCH: { name: 'Scholar', name_ja: '学者' },
	GEO: { name: 'Geomancer', name_ja: '風水士' },
	RUN: { name: 'Rune Fencer', name_ja: '魔導剣士' },
};

// ... (以下、MAJOR_SLOTS 等の既存コード)
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