import { NextResponse } from 'next/server'
// パスはご自身の構成に合わせてください (src/utils/supabase/server)
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url)
	const code = searchParams.get('code')
	// nextパラメータがあればそこへ、なければトップページへリダイレクト
	const next = searchParams.get('next') ?? '/'

	if (code) {
		const supabase = await createClient()

		// メールに含まれる認証コードを、ブラウザのログインセッションと交換する
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (!error) {
			return NextResponse.redirect(`${origin}${next}`)
		}
	}

	// エラー等の場合はログイン画面へ戻す
	return NextResponse.redirect(`${origin}/login?message=認証コードが無効です`)
}