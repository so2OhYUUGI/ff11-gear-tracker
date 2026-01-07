import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const supabase = await createClient();

	// 現在のユーザーがいるか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		// Supabaseからサインアウト
		await supabase.auth.signOut();
	}

	// トップページのキャッシュをクリアして、最新の状態（未ログイン状態）にする
	revalidatePath('/', 'layout');

	// ログイン画面にリダイレクト
	return NextResponse.redirect(new URL('/login', req.url), {
		status: 302,
	});
}