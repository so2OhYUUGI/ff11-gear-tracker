// src/lib/types.ts

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
	game_accounts?: GameAccount | GameAccount[]; // 結合データ用
}

export interface GroupedAccount {
	name: string;
	color: string;
	chars: Character[];
}