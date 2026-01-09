/**
 * src/lib/types.ts
 * 役割: アプリケーション全体で使用する共通の型定義
 */

export type GearCategory = 'AF' | 'Relic' | 'Empyrean';

export interface GameAccount {
	id: string;
	name: string;
	color_code: string | null;
}

export interface GearItem {
	id: string;
	name_ja: string;
	tier: number;
	category: GearCategory;
	slot: string;
}

export interface Character {
	id: string;
	name: string;
	world: string;
	last_job_code: string;
	game_accounts?: GameAccount | GameAccount[];
}

export interface GroupedAccount {
	name: string;
	color: string;
	chars: Character[];
}

export interface CharacterGear {
	id?: string;
	character_id: string;
	job_code: string;
	category: GearCategory; // ← 文字列ではなく GearCategory 型を指定
	slot: string;
	item_id: number;
	status?: string;
	updated_at?: string;
	// items? に既存の GearItem 型をそのまま使うように修正
	items?: GearItem;
}