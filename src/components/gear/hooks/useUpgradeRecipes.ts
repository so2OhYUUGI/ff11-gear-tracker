// src/hooks/useUpgradeRecipes.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUpgradeRecipes() {
	const [recipes, setRecipes] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const supabase = createClient();

	useEffect(() => {
		async function fetchRecipes() {
			// recipes (マスタ) -> recipe_requirements -> items を結合
			const { data, error } = await supabase
				.from('recipes')
				.select(`
          id,
          base_item_id,
          result_item_id,
          recipe_requirements (
            item_id,
            quantity,
            items (name_ja, name)
          )
        `);

			if (!error && data) setRecipes(data);
			setLoading(false);
		}
		fetchRecipes();
	}, []);

	const getRequirements = (baseItemId: string) => {
		const recipe = recipes.find(r => r.base_item_id === baseItemId);
		if (!recipe) return [];
		return recipe.recipe_requirements.map((req: any) => ({
			itemId: req.item_id,
			name: req.items?.name_ja || req.items?.name,
			required: req.quantity
		}));
	};

	return { getRequirements, loading };
}