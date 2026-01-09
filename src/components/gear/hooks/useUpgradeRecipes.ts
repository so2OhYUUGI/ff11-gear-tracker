'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GearItem } from '@/lib/types';

export interface Ingredient {
	item: GearItem;
	quantity: number;
}

export const useUpgradeRecipes = (currentItemId: number | null) => {
	const supabase = createClient();

	const [baseItem, setBaseItem] = useState<GearItem | null>(null);
	const [targetItem, setTargetItem] = useState<GearItem | null>(null);
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchRecipe() {
			if (!currentItemId) {
				setBaseItem(null);
				setTargetItem(null);
				setIngredients([]);
				return;
			}

			setLoading(true);

			try {
				// 1. 現在の装備情報の取得
				const { data: currentData, error: currentError } = await supabase
					.from('items')
					.select('*')
					.eq('id', currentItemId)
					.single();

				if (currentError) throw currentError;
				setBaseItem(currentData as GearItem);

				// 2. レシピ情報の取得 (characterIdに依存しない)
				// recipesテーブルのIDは text 型
				const { data: recipeData, error: recipeError } = await supabase
					.from('recipes')
					.select(`
						quantity,
						result_item:items!result_item_id(*),
						material_item:items!material_item_id(*)
					`)
					.eq('base_item_id', String(currentItemId));

				if (recipeError) throw recipeError;

				if (!recipeData || recipeData.length === 0) {
					// 強化先なし (Max Tier)
					setTargetItem(null);
					setIngredients([]);
				} else {
					// ターゲット情報のセット
					const firstRow = recipeData[0];
					setTargetItem(firstRow.result_item as unknown as GearItem);

					// 素材リストの構築 (所持数は取得しない)
					const ingredientsList = recipeData.map(r => ({
						item: r.material_item as unknown as GearItem,
						quantity: r.quantity
					}));

					setIngredients(ingredientsList);
				}

			} catch (err) {
				console.error('useUpgradeRecipes Error:', err);
			} finally {
				setLoading(false);
			}
		}

		fetchRecipe();
	}, [currentItemId, supabase]);

	// upgrade関数もここからは削除しました。
	// 実行ロジックはUI側または専用のMutationフックで行うべきだからです。

	return {
		baseItem,
		targetItem,
		ingredients,
		loading,
	};
};