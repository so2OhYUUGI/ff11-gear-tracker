'use client';

import { useUpgradeRecipes } from './hooks/useUpgradeRecipes';

interface GearUpgradeRecipeProps {
	itemId: number;
}

export default function GearUpgradeRecipe({ itemId }: GearUpgradeRecipeProps) {
	// フックは characterId 不要版になっている前提
	const { targetItem, ingredients, loading } = useUpgradeRecipes(itemId);

	if (loading) return <div className="text-[10px] text-gray-500 animate-pulse mt-1">Loading recipe...</div>;

	// 強化先がない（最大強化済み）場合は何も表示しない
	if (!targetItem) return null;

	return (
		<div className="mt-2 p-2 bg-slate-900/40 rounded border border-slate-700/50">
			{/* ヘッダー: 次の装備名 */}
			<div className="text-xs text-gray-400 mb-1.5 flex items-center gap-2">
				<span className="text-[10px] uppercase tracking-wider text-gray-500">Next</span>
				<span className="text-green-400 font-bold">{targetItem.name_ja}</span>
				<span className="text-[10px] text-gray-600 bg-black/30 px-1 rounded">Tier {targetItem.tier}</span>
			</div>

			{/* 素材リスト (アイコン的に表示) */}
			<div className="flex flex-wrap gap-1">
				{ingredients.map((ing, idx) => (
					<span
						key={idx}
						className="text-[10px] px-1.5 py-0.5 rounded border bg-slate-800 border-slate-600 text-gray-300 whitespace-nowrap"
					>
						{ing.item.name_ja} <span className="text-gray-500">x</span>{ing.quantity}
					</span>
				))}
			</div>
		</div>
	);
}