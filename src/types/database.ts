export interface Character {
	id: string;
	user_id: string;
	name: string;
	world: string;
	account_label: string | null;
	race: string;
	gender: string;
	created_at: string;
}

export interface CharacterFormData {
	name: string;
	world: string;
	account_label: string;
	race: string;
	gender: string;
}