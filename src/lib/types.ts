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

export interface GearItem {
	id: string;        // integer型に合わせて string から number へ変更
	name_ja: string;
	category: string;
	tier: number;
	jobs: string[];
	slot: string;
	// 他のプロパティがあれば適宜追加
}

export interface CharacterGear {
	id?: string;       // UUIDなので string のまま
	character_id: string; // UUIDなので string のまま
	job_code: string;
	category: GearCategory;
	slot: string;
	item_id: string;   // integer型に合わせて string から number へ変更
	status?: string;
	updated_at?: string;
	items?: GearItem;
}