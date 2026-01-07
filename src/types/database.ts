export interface Item {
	id: string;
	name: string;
	category: string;
}

export interface Inventory {
	character_id: string;
	item_id: string;
	quantity: number;
	location: string;
}

export interface Character {
	id: string;
	user_id: string;
	name: string;
	world: string;
	inventories?: Inventory[];
}