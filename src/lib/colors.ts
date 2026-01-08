// src/lib/colors.ts

const SYSTEM_COLORS = [
	'#3b82f6', // blue-500
	'#10b981', // emerald-500
	'#f59e0b', // amber-500
	'#ef4444', // rose-500
	'#8b5cf6', // violet-500
	'#06b6d4', // cyan-500
	'#f472b6', // pink-400
];

/**
 * 文字列（IDなど）から決定論的なシステムカラーを返します
 */
export function getSystemColor(seed: string): string {
	if (!seed) return '#64748b'; // slate-500
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = seed.charCodeAt(i) + ((hash << 5) - hash);
	}
	const index = Math.abs(hash) % SYSTEM_COLORS.length;
	return SYSTEM_COLORS[index];
}