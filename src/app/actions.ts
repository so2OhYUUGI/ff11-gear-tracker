"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * ログイン処理
 */
export async function login(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		let message = "ログインに失敗しました";
		if (error.message === "Invalid login credentials") {
			message = "メールアドレスまたはパスワードが正しくありません";
		}
		return redirect(`/login?error=${encodeURIComponent(message)}`);
	}

	revalidatePath("/", "layout");
	redirect("/");
}

/**
 * 新規登録処理
 */
export async function signup(formData: FormData) {
	const supabase = await createClient();
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
		},
	});

	if (error) {
		return redirect(`/login?error=${encodeURIComponent(error.message)}`);
	}

	return redirect("/login?message=確認メールを送信しました。メールボックスをチェックしてください");
}

/**
 * 在庫の更新（Dashboard用）
 */
export async function updateInventory(
	characterId: string,
	itemId: string,
	quantity: number
) {
	const supabase = await createClient();

	// ユーザーチェック
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("認証が必要です");

	// 在庫の保存 (Upsert)
	const { error } = await supabase
		.from("inventories")
		.upsert(
			{
				character_id: characterId,
				item_id: itemId,
				quantity: Math.max(0, quantity),
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

	revalidatePath("/");
}

/**
 * キャラクター作成（Wizard用 - もしコンポーネント外から呼ぶ場合）
 */
export async function createCharacterAction(name: string, world: string, accountId?: string) {
	const supabase = await createClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("認証が必要です");

	const { data, error } = await supabase
		.from("characters")
		.insert({
			user_id: user.id,
			account_id: accountId,
			name,
			world,
		})
		.select()
		.single();

	if (error) throw error;

	revalidatePath("/");
	return data;
}