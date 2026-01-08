export const MAJOR_SLOTS = [
	{ id: 'head', name: '頭', icon: '🪖' },
	{ id: 'body', name: '胴', icon: '👕' },
	{ id: 'hands', name: '手', icon: '🧤' },
	{ id: 'legs', name: '脚', icon: '👖' },
	{ id: 'feet', name: '足', icon: '👟' },
] as const;

export type SlotId = typeof MAJOR_SLOTS[number]['id'];