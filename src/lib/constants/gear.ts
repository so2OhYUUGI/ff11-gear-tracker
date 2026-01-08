// src/lib/constants/gear.ts

import { GearCategory } from "../types";

export type TierInfo = {
	tier: number;
	label: string;
};

export const GEAR_TIERS: Record<GearCategory, TierInfo[]> = {
	AF: [
		{ tier: 0, label: 'NQ' },
		{ tier: 1, label: '+1' },
		{ tier: 2, label: '109' },
		{ tier: 3, label: '119' },
		{ tier: 4, label: '119+2' },
		{ tier: 5, label: '119+3' },
		{ tier: 6, label: '119+4' },
	],
	Relic: [
		{ tier: 0, label: 'NQ' },
		{ tier: 1, label: '+1' },
		{ tier: 2, label: '+2' },
		{ tier: 3, label: '+2(Aug)' },
		{ tier: 4, label: '109' },
		{ tier: 5, label: '119' },
		{ tier: 6, label: '119+2' },
		{ tier: 7, label: '119+3' },
		{ tier: 8, label: '119+4' },
	],
	Empyrean: [
		{ tier: 0, label: 'NQ' },
		{ tier: 1, label: '+1' },
		{ tier: 2, label: '+2' },
		{ tier: 3, label: '109' },
		{ tier: 4, label: '119' },
		{ tier: 5, label: '119+2' },
		{ tier: 6, label: '119+3' },
	]
};

// ジョブごとの特殊ルール（開始地点の制限）
export const JOB_START_TIER: Record<string, number> = {
	GEO: 109, // 109 (AF/Relic/Empy共通の最低ライン)
	RUN: 109, // 109
};

// 各カテゴリーにおける 109 のティア数値を定義
// AF: NQ(0), +1(1), 109(2)
// Relic: NQ(0), +1(1), +2(2), +2Aug(3), 109(4)
// Empy: NQ(0), +1(1), +2(2), 109(3)
export const TIER_109_VALUE: Record<GearCategory, number> = {
	AF: 2,
	Relic: 4,
	Empyrean: 3,
};

// 剣風(GEO/RUN)などの特殊な開始ルールを持つジョブ
export const JOB_MIN_TIER_RULES: Record<string, Record<GearCategory, number>> = {
	GEO: TIER_109_VALUE,
	RUN: TIER_109_VALUE,
};