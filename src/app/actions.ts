"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInventory(
	characterId: string,
	itemId: string,
	quantity: number
) {
	const supabase = await createClient();

	// 1. ユーザー認証チェック
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("認証が必要です");

	// 2. キャラクター所有権チェック (セキュリティ向上)
	const { data: char, error: charError } = await supabase
		.from('characters')
		.select('id')
		.eq('id', characterId)
		.eq('user_id', user.id)
		.single();

	if (charError || !char) throw new Error("キャラクターが見つからないか、権限がありません");

	// 3. 在庫のUpsert
	const { error } = await supabase
		.from("inventories")
		.upsert(
			{
				character_id: characterId,
				item_id: itemId,
				quantity: quantity,
				location: "inventory",
			},
			{
				onConflict: "character_id,item_id,location",
			}
		);

	if (error) {
		console.error("Supabase error:", error.message);
		throw new Error("在庫の更新に失敗しました");
	}

	// データを再検証して画面を更新
	revalidatePath("/");
}