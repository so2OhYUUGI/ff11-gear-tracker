/**
 * src/lib/types.ts
 * 役割: アプリケーション全体で使用する共通の型定義
 */

// -----------------------------------------------------------------------------
// 基本区分値 (Source of Truth)
// -----------------------------------------------------------------------------

export type JobCode =
	| 'WAR' | 'MNK' | 'WHM' | 'BLM' | 'RDM' | 'THF' | 'PLD' | 'DRK' | 'BST' | 'BRD'
	| 'RNG' | 'SAM' | 'NIN' | 'DRG' | 'SMN' | 'BLU' | 'COR' | 'PUP' | 'DNC' | 'SCH'
	| 'GEO' | 'RUN';

export type SlotCode =
	| 'main' | 'sub' | 'range' | 'ammo'
	| 'head' | 'neck' | 'ear1' | 'ear2'
	| 'body' | 'hands' | 'ring1' | 'ring2'
	| 'back' | 'waist' | 'legs' | 'feet';

export type Race = 'Hume' | 'Elvaan' | 'Tarutaru' | 'Mithra' | 'Galka';

export type Gender = 'Male' | 'Female';

export type GearCategory = 'AF' | 'Relic' | 'Empyrean';


// -----------------------------------------------------------------------------
// データモデル
// -----------------------------------------------------------------------------

export interface GameAccount {
	id: string;
	name: string;
	color_code: string | null;
}

export interface Character {
	id: string;
	name: string;
	world: string;
	last_job_code: JobCode | string; // 移行期のため string も許容、将来的には JobCode のみ推奨
	game_accounts?: GameAccount | GameAccount[];
}

export interface GroupedAccount {
	name: string;
	color: string;
	chars: Character[];
}

export interface GearItem {
	id: number; // integer型へ変更 (DBの serial に合わせる)
	name_ja: string;
	category: GearCategory;
	tier: number;
	jobs: JobCode[];
	slot: SlotCode | string; // 基本は SlotCode だが、DB値との互換性のため string も許容
	// 他のプロパティがあれば適宜追加
}

export interface CharacterGear {
	id?: string; // UUID (characters_gear テーブルの主キー)
	character_id: string; // UUID
	job_code: JobCode;
	category: GearCategory;
	slot: SlotCode | string;
	item_id: number; // integer型へ変更 (items テーブルの id 参照)
	status?: string;
	updated_at?: string;
	items?: GearItem;
}