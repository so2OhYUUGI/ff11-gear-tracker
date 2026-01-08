// src/lib/colors.ts

const SYSTEM_COLORS = [
	'#3b82f6', // blue-500
	'#10b981', // emerald-500
	'#f59e0b', // amber-500
	'#ef4444', // rose-500
	'#8b5cf6', // violet-500
	'#06b6d4', // cyan-500
	'#f472b6', // pink-400
	'#6366f1', // indigo-500
	'#84cc16', // lime-500
	'#f97316', // orange-500
	'#ec4899', // pink-500
	'#a855f7', // purple-500
	'#0ea5e9', // sky-500
	'#22c55e', // green-500
	'#eab308', // yellow-500
	'#d946ef', // fuchsia-500
	'#14b8a6', // teal-500
	'#f43f5e', // rose-500
	'#7c3aed', // violet-600
	'#2563eb', // blue-600
	'#059669', // emerald-600
];

/**
 * リストの順番（index）に基づいて色を返します。
 * これにより、21番目までは絶対に色が被りません。
 */
export function getColorByIndex(index: number): string {
	if (index === 999) return '#94a3b8'; // 未紐付け用の slate-400
	return SYSTEM_COLORS[index % SYSTEM_COLORS.length];
}

// 互換性のために残しますが、基本は上の index 版を使います
export function getSystemColor(seed: string): string {
	if (!seed) return '#64748b';
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = seed.charCodeAt(i) + ((hash << 5) - hash);
	}
	return SYSTEM_COLORS[Math.abs(hash) % SYSTEM_COLORS.length];
}