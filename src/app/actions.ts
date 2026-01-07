"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateInventory(characterId: string, itemId: string, quantity: number) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("Unauthorized");

	// セキュリティガード：このキャラがログインユーザーのものか再確認
	const { data: char, error: charError } = await supabase
		.from('characters')
		.select('id')
		.eq('id', characterId)
		.eq('user_id', user.id)
		.single();

	if (charError || !char) {
		throw new Error("指定されたキャラクターの操作権限がありません");
	}

	const { error } = await supabase
		.from("inventories")
		.upsert({
			character_id: characterId,
			item_id: itemId,
			quantity: Math.max(0, quantity), // 念のため負の数を防ぐ
			location: "inventory",
		}, {
			onConflict: "character_id,item_id,location"
		});

	if (error) throw error;

	// 指定したパスのキャッシュを更新
	revalidatePath("/");
}