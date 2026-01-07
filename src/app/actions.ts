"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 在庫数を更新（または新規作成）する
 */
export async function updateInventory(
	characterId: string,
	itemId: string,
	quantity: number
) {
	const supabase = await createClient();

	const { error } = await supabase
		.from("inventories")
		.upsert(
			{
				character_id: characterId,
				item_id: itemId,
				quantity: quantity,
				location: "inventory", // デフォルト
			},
			{
				onConflict: "character_id,item_id,location", // 複合ユニーク制約に基づく
			}
		);

	if (error) {
		console.error("Supabase error:", error.message);
		throw new Error("在庫の更新に失敗しました");
	}

	// ページ内のデータを最新にする
	revalidatePath("/");
}

/**
 * キャラクターを作成する（ウィザード用）
 */
export async function createCharacter(name: string, world: string) {
	const supabase = await createClient();

	// ログインユーザーのIDを取得
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("認証が必要です");

	const { data, error } = await supabase
		.from("characters")
		.insert({
			user_id: user.id,
			name,
			world,
		})
		.select()
		.single();

	if (error) {
		console.error("Supabase error:", error.message);
		throw new Error("キャラクターの作成に失敗しました");
	}

	revalidatePath("/");
	return data;
}