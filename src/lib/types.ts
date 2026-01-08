// src/lib/types.ts

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

export interface CharacterGear {
	slot: string;
	items: GearItem;
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