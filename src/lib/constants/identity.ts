export const WORLDS = [
	'Asura', 'Bahamut', 'Bismarck', 'Carbuncle', 'Cerberus', 'Fenrir',
	'Lakshmi', 'Leviathan', 'Odin', 'Phoenix', 'Quetzalcoatl', 'Ragnarok',
	'Shiva', 'Siren', 'Valefor'
] as const;

export const RACES = ['Hume', 'Elvaan', 'Tarutaru', 'Mithra', 'Galka'] as const;
export type Race = typeof RACES[number];
export type Gender = 'Male' | 'Female';