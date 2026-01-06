import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default function Login({
	searchParams,
}: {
	searchParams: Promise<{ message: string }> // Next.js 15ではPromiseになるため修正推奨ですが、今のままでも動く場合はそのままでOK
}) {
	// ログイン処理 (Server Action)
	const signIn = async (formData: FormData) => {
		'use server'

		const email = formData.get('email') as string
		const password = formData.get('password') as string

		// await を追加
		const supabase = await createClient()

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (error) {
			// 日本語をエンコード
			return redirect(`/login?message=${encodeURIComponent('ログインに失敗しました')}`)
		}

		return redirect('/')
	}

	// 新規登録処理 (Server Action)
	const signUp = async (formData: FormData) => {
		'use server'

		// await を追加
		const origin = (await headers()).get('origin')
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		// await を追加
		const supabase = await createClient()

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${origin}/auth/callback`,
			},
		})

		if (error) {
			// 日本語をエンコード
			return redirect(`/login?message=${encodeURIComponent('登録エラーが発生しました: ' + error.message)}`)
		}

		// 日本語をエンコード
		return redirect(`/login?message=${encodeURIComponent('確認メールを送信しました。メール内のリンクをクリックしてください。')}`)
	}

	return (
		<div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
			<form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
				<h1 className="text-2xl font-bold mb-4 text-center">FF11 Gear Tracker</h1>

				<label className="text-md" htmlFor="email">
					メールアドレス
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					name="email"
					placeholder="you@example.com"
					required
				/>

				<label className="text-md" htmlFor="password">
					パスワード
				</label>
				<input
					className="rounded-md px-4 py-2 bg-inherit border mb-6"
					type="password"
					name="password"
					placeholder="••••••••"
					required
				/>

				<button
					formAction={signIn}
					className="bg-indigo-600 rounded-md px-4 py-2 text-white mb-2 hover:bg-indigo-700"
				>
					ログイン
				</button>

				<button
					formAction={signUp}
					className="border border-gray-400 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 mb-2"
				>
					新規登録
				</button>

				{/* 
           Next.js 15の場合、searchParamsの取得方法が変わっていますが、
           一旦簡易的な表示のため、そのままメッセージがあれば表示する形にします 
        */}
			</form>
		</div>
	)
}